/**
 * Production Benchmarking Suite
 * Comprehensive performance testing for Express.js vs Fastify decision
 */

import autocannon from 'autocannon';
import { performance } from 'perf_hooks';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Comprehensive benchmarking suite for framework comparison
 */
class FrameworkBenchmark {
  constructor() {
    this.results = {
      express: {},
      fastify: {},
      comparison: {},
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        cpus: require('os').cpus().length,
        memory: Math.round(require('os').totalmem() / 1024 / 1024 / 1024) + 'GB'
      }
    };
  }

  /**
   * Run comprehensive benchmarks against both frameworks
   */
  async runFullBenchmark(expressUrl, fastifyUrl) {
    console.log('🚀 Starting comprehensive framework benchmark...\n');
    
    // Test configurations
    const testScenarios = [
      {
        name: 'Light Load',
        connections: 10,
        duration: 30,
        description: 'Normal development usage'
      },
      {
        name: 'Medium Load',
        connections: 50,
        duration: 30,
        description: 'Multiple developers using dashboard'
      },
      {
        name: 'Heavy Load',
        connections: 100,
        duration: 30,
        description: 'Enterprise team usage'
      },
      {
        name: 'Stress Test',
        connections: 200,
        duration: 15,
        description: 'Maximum capacity testing'
      }
    ];

    const endpoints = [
      {
        path: '/api/health',
        method: 'GET',
        name: 'Health Check',
        description: 'Basic health endpoint'
      },
      {
        path: '/api/health/run',
        method: 'POST',
        name: 'Comprehensive Health',
        description: 'Complex health check with analysis'
      },
      {
        path: '/api/project/context',
        method: 'GET',
        name: 'Project Context',
        description: 'Project information endpoint'
      },
      {
        path: '/api/dependencies/analyze',
        method: 'POST',
        name: 'Dependency Analysis',
        description: 'CPU-intensive analysis endpoint',
        body: JSON.stringify({ focus: 'security' })
      }
    ];

    // Run benchmarks for each framework
    console.log('📊 Testing Express.js...');
    this.results.express = await this.benchmarkFramework(expressUrl, testScenarios, endpoints, 'Express.js');
    
    console.log('\n⚡ Testing Fastify...');
    this.results.fastify = await this.benchmarkFramework(fastifyUrl, testScenarios, endpoints, 'Fastify');
    
    // Generate comparison analysis
    this.results.comparison = this.generateComparison();
    
    // Generate detailed report
    const report = this.generateReport();
    
    // Save results
    this.saveResults();
    
    console.log('\n✅ Benchmark completed! Results saved to benchmark-results.json');
    console.log('\n📈 Performance Summary:');
    console.log(this.results.comparison.summary);
    
    return this.results;
  }

  /**
   * Benchmark a specific framework across all scenarios and endpoints
   */
  async benchmarkFramework(baseUrl, scenarios, endpoints, frameworkName) {
    const frameworkResults = {
      framework: frameworkName,
      baseUrl,
      scenarios: {},
      endpoints: {},
      summary: {}
    };

    // Test each endpoint across all scenarios
    for (const endpoint of endpoints) {
      console.log(`  Testing ${endpoint.name}...`);
      frameworkResults.endpoints[endpoint.name] = {};
      
      for (const scenario of scenarios) {
        const url = `${baseUrl}${endpoint.path}`;
        const result = await this.runBenchmark(url, {
          connections: scenario.connections,
          duration: scenario.duration,
          method: endpoint.method,
          body: endpoint.body
        });
        
        frameworkResults.endpoints[endpoint.name][scenario.name] = result;
        console.log(`    ${scenario.name}: ${result.requests.average.toFixed(0)} req/s, ${result.latency.average.toFixed(1)}ms avg`);
      }
    }

    // Calculate framework summary
    frameworkResults.summary = this.calculateFrameworkSummary(frameworkResults.endpoints);
    
    return frameworkResults;
  }

  /**
   * Run individual benchmark test
   */
  async runBenchmark(url, options) {
    const {
      connections = 10,
      duration = 30,
      method = 'GET',
      body = null
    } = options;

    const config = {
      url,
      connections,
      duration,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      config.body = body;
    }

    try {
      const result = await autocannon(config);
      return {
        requests: {
          total: result.requests.total,
          average: result.requests.average,
          max: result.requests.max,
          min: result.requests.min
        },
        latency: {
          average: result.latency.average,
          max: result.latency.max,
          min: result.latency.min,
          p50: result.latency.p50,
          p95: result.latency.p95,
          p99: result.latency.p99
        },
        throughput: {
          average: result.throughput.average,
          max: result.throughput.max,
          min: result.throughput.min
        },
        errors: result.errors,
        timeouts: result.timeouts,
        duration: result.duration,
        connections: result.connections
      };
    } catch (error) {
      console.error(`  ❌ Benchmark failed for ${url}:`, error.message);
      return {
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Calculate summary statistics for a framework
   */
  calculateFrameworkSummary(endpoints) {
    let totalRequests = 0;
    let totalLatency = 0;
    let totalThroughput = 0;
    let testCount = 0;
    let errorCount = 0;

    Object.values(endpoints).forEach(endpointResults => {
      Object.values(endpointResults).forEach(scenarioResult => {
        if (scenarioResult.error) {
          errorCount++;
          return;
        }
        
        totalRequests += scenarioResult.requests.average;
        totalLatency += scenarioResult.latency.average;
        totalThroughput += scenarioResult.throughput.average;
        testCount++;
      });
    });

    return {
      averageRequestsPerSecond: testCount > 0 ? totalRequests / testCount : 0,
      averageLatency: testCount > 0 ? totalLatency / testCount : 0,
      averageThroughput: testCount > 0 ? totalThroughput / testCount : 0,
      totalTests: testCount,
      errors: errorCount,
      reliability: testCount > 0 ? ((testCount - errorCount) / testCount) * 100 : 0
    };
  }

  /**
   * Generate comprehensive comparison analysis
   */
  generateComparison() {
    const express = this.results.express.summary;
    const fastify = this.results.fastify.summary;
    
    if (!express || !fastify) {
      return { error: 'Incomplete benchmark data' };
    }

    const requestsImprovement = ((fastify.averageRequestsPerSecond - express.averageRequestsPerSecond) / express.averageRequestsPerSecond) * 100;
    const latencyImprovement = ((express.averageLatency - fastify.averageLatency) / express.averageLatency) * 100;
    const throughputImprovement = ((fastify.averageThroughput - express.averageThroughput) / express.averageThroughput) * 100;

    const winner = {
      requests: fastify.averageRequestsPerSecond > express.averageRequestsPerSecond ? 'Fastify' : 'Express.js',
      latency: fastify.averageLatency < express.averageLatency ? 'Fastify' : 'Express.js',
      throughput: fastify.averageThroughput > express.averageThroughput ? 'Fastify' : 'Express.js',
      reliability: fastify.reliability > express.reliability ? 'Fastify' : 'Express.js'
    };

    // Decision recommendation based on metrics
    const significantImprovement = Math.abs(requestsImprovement) > 50; // 50% improvement threshold
    const meetsMigrationCriteria = significantImprovement && latencyImprovement > 0 && fastify.reliability > 95;

    return {
      performance: {
        requestsPerSecond: {
          express: express.averageRequestsPerSecond.toFixed(1),
          fastify: fastify.averageRequestsPerSecond.toFixed(1),
          improvement: requestsImprovement.toFixed(1) + '%',
          winner: winner.requests
        },
        latency: {
          express: express.averageLatency.toFixed(2) + 'ms',
          fastify: fastify.averageLatency.toFixed(2) + 'ms',
          improvement: latencyImprovement.toFixed(1) + '%',
          winner: winner.latency
        },
        throughput: {
          express: (express.averageThroughput / 1024 / 1024).toFixed(2) + 'MB/s',
          fastify: (fastify.averageThroughput / 1024 / 1024).toFixed(2) + 'MB/s',
          improvement: throughputImprovement.toFixed(1) + '%',
          winner: winner.throughput
        },
        reliability: {
          express: express.reliability.toFixed(1) + '%',
          fastify: fastify.reliability.toFixed(1) + '%',
          winner: winner.reliability
        }
      },
      recommendation: {
        migrate: meetsMigrationCriteria,
        reasoning: meetsMigrationCriteria 
          ? `Fastify shows significant performance improvement (${requestsImprovement.toFixed(1)}% faster) with better latency and high reliability`
          : `Performance improvement (${requestsImprovement.toFixed(1)}%) may not justify migration complexity`,
        confidence: significantImprovement ? 'High' : requestsImprovement > 20 ? 'Medium' : 'Low',
        riskLevel: meetsMigrationCriteria ? 'Acceptable' : 'Consider alternatives'
      },
      summary: `Fastify is ${Math.abs(requestsImprovement).toFixed(1)}% ${requestsImprovement > 0 ? 'faster' : 'slower'} than Express.js with ${Math.abs(latencyImprovement).toFixed(1)}% ${latencyImprovement > 0 ? 'better' : 'worse'} latency`
    };
  }

  /**
   * Generate detailed markdown report
   */
  generateReport() {
    const comparison = this.results.comparison;
    
    return `# Framework Performance Benchmark Report

**Generated:** ${this.results.timestamp}
**Environment:** Node.js ${this.results.environment.nodeVersion} on ${this.results.environment.platform}
**Hardware:** ${this.results.environment.cpus} CPUs, ${this.results.environment.memory} RAM

## Executive Summary

${comparison.summary}

**Recommendation:** ${comparison.recommendation.migrate ? '✅ PROCEED WITH FASTIFY MIGRATION' : '❌ REMAIN WITH EXPRESS.JS'}

**Reasoning:** ${comparison.recommendation.reasoning}

**Confidence Level:** ${comparison.recommendation.confidence}

## Performance Comparison

### Requests per Second
- **Express.js:** ${comparison.performance.requestsPerSecond.express} req/s
- **Fastify:** ${comparison.performance.requestsPerSecond.fastify} req/s
- **Improvement:** ${comparison.performance.requestsPerSecond.improvement}
- **Winner:** ${comparison.performance.requestsPerSecond.winner}

### Latency
- **Express.js:** ${comparison.performance.latency.express}
- **Fastify:** ${comparison.performance.latency.fastify}
- **Improvement:** ${comparison.performance.latency.improvement}
- **Winner:** ${comparison.performance.latency.winner}

### Throughput
- **Express.js:** ${comparison.performance.throughput.express}
- **Fastify:** ${comparison.performance.throughput.fastify}
- **Improvement:** ${comparison.performance.throughput.improvement}
- **Winner:** ${comparison.performance.throughput.winner}

### Reliability
- **Express.js:** ${comparison.performance.reliability.express}
- **Fastify:** ${comparison.performance.reliability.fastify}
- **Winner:** ${comparison.performance.reliability.winner}

## Decision Matrix

| Criteria | Express.js | Fastify | Winner |
|----------|------------|---------|---------|
| Performance | ${comparison.performance.requestsPerSecond.express} | ${comparison.performance.requestsPerSecond.fastify} | ${comparison.performance.requestsPerSecond.winner} |
| Latency | ${comparison.performance.latency.express} | ${comparison.performance.latency.fastify} | ${comparison.performance.latency.winner} |
| Throughput | ${comparison.performance.throughput.express} | ${comparison.performance.throughput.fastify} | ${comparison.performance.throughput.winner} |
| Reliability | ${comparison.performance.reliability.express} | ${comparison.performance.reliability.fastify} | ${comparison.performance.reliability.winner} |

## Detailed Results

### Express.js Framework
- **Average Requests/Second:** ${this.results.express.summary.averageRequestsPerSecond.toFixed(1)}
- **Average Latency:** ${this.results.express.summary.averageLatency.toFixed(2)}ms
- **Average Throughput:** ${(this.results.express.summary.averageThroughput / 1024 / 1024).toFixed(2)}MB/s
- **Reliability:** ${this.results.express.summary.reliability.toFixed(1)}%

### Fastify Framework
- **Average Requests/Second:** ${this.results.fastify.summary.averageRequestsPerSecond.toFixed(1)}
- **Average Latency:** ${this.results.fastify.summary.averageLatency.toFixed(2)}ms
- **Average Throughput:** ${(this.results.fastify.summary.averageThroughput / 1024 / 1024).toFixed(2)}MB/s
- **Reliability:** ${this.results.fastify.summary.reliability.toFixed(1)}%

## Recommendations

Based on the benchmark results:

${comparison.recommendation.migrate 
  ? '### ✅ MIGRATE TO FASTIFY\n\nThe performance improvements justify the migration effort:\n- Significant performance gains\n- Better latency characteristics\n- High reliability\n- Modern architecture benefits'
  : '### ❌ ENHANCE EXPRESS.JS\n\nOptimize the current Express.js implementation:\n- Performance gains insufficient for migration complexity\n- Focus on Express.js optimizations\n- Consider Fastify for future major versions'
}

## Next Steps

1. **Review Results:** Share benchmark data with stakeholders
2. **Team Assessment:** Evaluate team readiness for chosen path
3. **Timeline Planning:** Adjust project timeline based on decision
4. **Implementation:** Begin selected approach (migration or optimization)

---

*Benchmark completed using autocannon load testing tool*
*Results based on ${this.results.express.summary.totalTests + this.results.fastify.summary.totalTests} individual test scenarios*
`;
  }

  /**
   * Save benchmark results to files
   */
  saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save raw JSON data
    writeFileSync(
      join(process.cwd(), `benchmark-results-${timestamp}.json`),
      JSON.stringify(this.results, null, 2)
    );
    
    // Save markdown report
    writeFileSync(
      join(process.cwd(), `benchmark-report-${timestamp}.md`),
      this.generateReport()
    );
    
    // Save summary for quick reference
    writeFileSync(
      join(process.cwd(), 'benchmark-summary.json'),
      JSON.stringify({
        timestamp: this.results.timestamp,
        recommendation: this.results.comparison.recommendation,
        summary: this.results.comparison.summary,
        performance: this.results.comparison.performance
      }, null, 2)
    );
  }
}

/**
 * Quick benchmark function for immediate comparison
 */
export async function quickBenchmark(expressUrl, fastifyUrl) {
  console.log('⚡ Running quick performance comparison...\n');
  
  const benchmark = new FrameworkBenchmark();
  
  // Single endpoint, light load test
  const testConfig = {
    connections: 10,
    duration: 10
  };
  
  console.log('Testing Express.js health endpoint...');
  const expressResult = await benchmark.runBenchmark(`${expressUrl}/api/health`, testConfig);
  
  console.log('Testing Fastify health endpoint...');
  const fastifyResult = await benchmark.runBenchmark(`${fastifyUrl}/api/health`, testConfig);
  
  if (expressResult.error || fastifyResult.error) {
    console.error('❌ Quick benchmark failed');
    return null;
  }
  
  const improvement = ((fastifyResult.requests.average - expressResult.requests.average) / expressResult.requests.average) * 100;
  const latencyImprovement = ((expressResult.latency.average - fastifyResult.latency.average) / expressResult.latency.average) * 100;
  
  console.log('\n📊 Quick Comparison Results:');
  console.log(`Express.js: ${expressResult.requests.average.toFixed(1)} req/s, ${expressResult.latency.average.toFixed(1)}ms avg`);
  console.log(`Fastify: ${fastifyResult.requests.average.toFixed(1)} req/s, ${fastifyResult.latency.average.toFixed(1)}ms avg`);
  console.log(`Performance: ${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}% requests/sec`);
  console.log(`Latency: ${latencyImprovement > 0 ? '-' : '+'}${Math.abs(latencyImprovement).toFixed(1)}% response time`);
  
  return {
    express: expressResult,
    fastify: fastifyResult,
    improvement: improvement.toFixed(1),
    latencyImprovement: latencyImprovement.toFixed(1),
    recommendation: improvement > 50 ? 'Consider migration' : 'Optimize Express.js'
  };
}

export { FrameworkBenchmark };
