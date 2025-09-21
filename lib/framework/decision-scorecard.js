/**
 * Production Decision Scorecard
 * Data-driven framework decision evaluation tool
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Decision Scorecard Manager
 * Evaluates all criteria and generates final recommendation
 */
class DecisionScorecard {
  constructor() {
    this.criteria = {
      // P0 - Critical Success Factors (70% weight)
      timelineImpact: {
        weight: 0.35,
        threshold: "Cannot delay 8-week dashboard by >1 week",
        measurement: "Calendar weeks to Phase 4 completion",
        values: {
          express: { score: 0, reason: "", data: {} },
          fastify: { score: 0, reason: "", data: {} }
        }
      },
      
      performanceRequirements: {
        weight: 0.25,
        threshold: "WebSocket response <100ms, API endpoints <200ms", 
        measurement: "Load testing results under enterprise conditions",
        values: {
          express: { score: 0, reason: "", data: {} },
          fastify: { score: 0, reason: "", data: {} }
        }
      },
      
      technicalDebtRisk: {
        weight: 0.20,
        threshold: "Framework choice affects 8+ weeks of development",
        measurement: "Migration cost analysis + future maintenance overhead",
        values: {
          express: { score: 0, reason: "", data: {} },
          fastify: { score: 0, reason: "", data: {} }
        }
      },
      
      // P1 - Important Factors (30% weight)
      teamCapability: {
        weight: 0.15,
        threshold: "Team can execute migration without velocity loss >20%",
        measurement: "Team assessment + training time requirements",
        values: {
          express: { score: 0, reason: "", data: {} },
          fastify: { score: 0, reason: "", data: {} }
        }
      },
      
      competitiveAdvantage: {
        weight: 0.05,
        threshold: "Performance differential noticeable to enterprise users",
        measurement: "Benchmark comparison + user experience testing",
        values: {
          express: { score: 0, reason: "", data: {} },
          fastify: { score: 0, reason: "", data: {} }
        }
      }
    };
    
    this.scorecard = {
      timestamp: new Date().toISOString(),
      criteria: this.criteria,
      scores: {
        express: { total: 0, weighted: 0, breakdown: {} },
        fastify: { total: 0, weighted: 0, breakdown: {} }
      },
      recommendation: null,
      confidence: 'Unknown',
      dataInputs: {}
    };
  }

  /**
   * Load data from various sources and calculate scores
   */
  async evaluateAllCriteria() {
    console.log('📊 Evaluating decision criteria...\n');

    // Load data from files if available
    await this.loadBenchmarkData();
    await this.loadQualityGatesData();
    await this.loadTeamAssessmentData();

    // Evaluate each criterion
    this.evaluateTimelineImpact();
    this.evaluatePerformanceRequirements();
    this.evaluateTechnicalDebtRisk();
    this.evaluateTeamCapability();
    this.evaluateCompetitiveAdvantage();

    // Calculate final scores
    this.calculateFinalScores();
    
    // Generate recommendation
    this.generateRecommendation();

    // Save results
    this.saveScorecard();

    return this.scorecard;
  }

  /**
   * Load benchmark data from benchmark results
   */
  async loadBenchmarkData() {
    const benchmarkPath = join(process.cwd(), 'benchmark-summary.json');
    
    if (existsSync(benchmarkPath)) {
      try {
        const benchmarkData = JSON.parse(readFileSync(benchmarkPath, 'utf8'));
        this.scorecard.dataInputs.benchmark = benchmarkData;
        console.log('✅ Loaded benchmark data');
      } catch (error) {
        console.log('⚠️ Failed to load benchmark data:', error.message);
      }
    } else {
      console.log('ℹ️ No benchmark data found - using defaults');
    }
  }

  /**
   * Load quality gates data
   */
  async loadQualityGatesData() {
    const qualityPath = join(process.cwd(), 'quality-gates-latest.json');
    
    if (existsSync(qualityPath)) {
      try {
        const qualityData = JSON.parse(readFileSync(qualityPath, 'utf8'));
        this.scorecard.dataInputs.quality = qualityData;
        console.log('✅ Loaded quality gates data');
      } catch (error) {
        console.log('⚠️ Failed to load quality gates data:', error.message);
      }
    } else {
      console.log('ℹ️ No quality gates data found - using defaults');
    }
  }

  /**
   * Load team assessment data
   */
  async loadTeamAssessmentData() {
    const teamPath = join(process.cwd(), 'team-assessment.json');
    
    if (existsSync(teamPath)) {
      try {
        const teamData = JSON.parse(readFileSync(teamPath, 'utf8'));
        this.scorecard.dataInputs.team = teamData;
        console.log('✅ Loaded team assessment data');
      } catch (error) {
        console.log('⚠️ Failed to load team assessment data:', error.message);
      }
    } else {
      console.log('ℹ️ No team assessment data found - creating template');
      this.createTeamAssessmentTemplate();
    }
  }

  /**
   * Create team assessment template
   */
  createTeamAssessmentTemplate() {
    const template = {
      timestamp: new Date().toISOString(),
      teamSize: 3,
      expressExperience: {
        senior: 2,
        intermediate: 1,
        junior: 0,
        averageYears: 3.5
      },
      fastifyExperience: {
        senior: 0,
        intermediate: 1,
        junior: 2,
        averageYears: 0.5
      },
      learningCapacity: {
        hoursAvailablePerWeek: 8,
        preferredLearningStyle: "hands-on",
        previousFrameworkMigrations: 1
      },
      confidence: {
        expressOptimization: 8.5,
        fastifyMigration: 6.0,
        timeline: 7.5
      },
      concerns: [
        "Learning curve for new framework",
        "Timeline pressure",
        "Integration complexity"
      ]
    };

    const templatePath = join(process.cwd(), 'team-assessment-template.json');
    writeFileSync(templatePath, JSON.stringify(template, null, 2));
    console.log('📝 Created team assessment template at team-assessment-template.json');
    console.log('   Please fill out and rename to team-assessment.json');
  }

  /**
   * Evaluate timeline impact criterion
   */
  evaluateTimelineImpact() {
    const criterion = this.criteria.timelineImpact;

    // Express.js: Zero delay
    criterion.values.express = {
      score: 10,
      reason: "Zero delay to dashboard development",
      data: { 
        delayWeeks: 0,
        dashboardStartWeek: 3,
        completionWeek: 11
      }
    };

    // Fastify: 1-week migration delay
    criterion.values.fastify = {
      score: 8,
      reason: "1-week migration delay but better foundation",
      data: {
        delayWeeks: 1,
        migrationWeeks: 2,
        dashboardStartWeek: 5,
        completionWeek: 13
      }
    };

    console.log('📅 Timeline Impact: Express.js (10), Fastify (8)');
  }

  /**
   * Evaluate performance requirements criterion
   */
  evaluatePerformanceRequirements() {
    const criterion = this.criteria.performanceRequirements;
    const benchmark = this.scorecard.dataInputs.benchmark;

    if (benchmark && benchmark.performance) {
      // Use actual benchmark data
      const improvement = parseFloat(benchmark.performance.requestsPerSecond.improvement.replace('%', ''));
      
      criterion.values.express = {
        score: 6,
        reason: `Baseline performance: ${benchmark.performance.requestsPerSecond.express}`,
        data: {
          requestsPerSecond: parseFloat(benchmark.performance.requestsPerSecond.express),
          latency: benchmark.performance.latency.express,
          baseline: true
        }
      };

      criterion.values.fastify = {
        score: improvement > 50 ? 10 : improvement > 25 ? 8 : 7,
        reason: `${improvement}% performance improvement demonstrated`,
        data: {
          requestsPerSecond: parseFloat(benchmark.performance.requestsPerSecond.fastify),
          latency: benchmark.performance.latency.fastify,
          improvement: `${improvement}%`
        }
      };

      console.log(`⚡ Performance: Express.js (6), Fastify (${criterion.values.fastify.score}) - ${improvement}% improvement`);
    } else {
      // Use estimated values
      criterion.values.express = {
        score: 6,
        reason: "Express.js performance adequate for local development",
        data: { estimated: true, responseTime: "200-300ms", throughput: "moderate" }
      };

      criterion.values.fastify = {
        score: 9,
        reason: "Fastify expected 2-3x performance improvement",
        data: { estimated: true, responseTime: "100-150ms", throughput: "high" }
      };

      console.log('⚡ Performance: Express.js (6), Fastify (9) - estimated values');
    }
  }

  /**
   * Evaluate technical debt risk criterion
   */
  evaluateTechnicalDebtRisk() {
    const criterion = this.criteria.technicalDebtRisk;
    const quality = this.scorecard.dataInputs.quality;

    // Factor in current quality score
    const qualityScore = quality?.overall?.score || 70;
    const qualityMultiplier = qualityScore / 100;

    criterion.values.express = {
      score: Math.round(6 * qualityMultiplier),
      reason: "Building complex dashboard on Express.js accumulates technical debt",
      data: {
        currentQualityScore: qualityScore,
        futureComplexity: "high",
        migrationCostLater: "exponential",
        maintenanceOverhead: "increasing"
      }
    };

    criterion.values.fastify = {
      score: Math.round(9 * qualityMultiplier),
      reason: "Modern foundation reduces long-term technical debt",
      data: {
        currentQualityScore: qualityScore,
        futureComplexity: "low",
        migrationCostLater: "minimal",
        maintenanceOverhead: "stable"
      }
    };

    console.log(`🔧 Technical Debt: Express.js (${criterion.values.express.score}), Fastify (${criterion.values.fastify.score})`);
  }

  /**
   * Evaluate team capability criterion
   */
  evaluateTeamCapability() {
    const criterion = this.criteria.teamCapability;
    const team = this.scorecard.dataInputs.team;

    if (team) {
      // Use actual team data
      const expressConfidence = team.confidence?.expressOptimization || 8;
      const fastifyConfidence = team.confidence?.fastifyMigration || 6;

      criterion.values.express = {
        score: Math.round(expressConfidence),
        reason: `Team confidence: ${expressConfidence}/10 for Express.js optimization`,
        data: {
          experience: team.expressExperience,
          confidence: expressConfidence,
          estimatedVelocityImpact: "0-10%"
        }
      };

      criterion.values.fastify = {
        score: Math.round(fastifyConfidence),
        reason: `Team confidence: ${fastifyConfidence}/10 for Fastify migration`,
        data: {
          experience: team.fastifyExperience,
          confidence: fastifyConfidence,
          estimatedVelocityImpact: "20-30%",
          trainingRequired: true
        }
      };

      console.log(`👥 Team Capability: Express.js (${criterion.values.express.score}), Fastify (${criterion.values.fastify.score})`);
    } else {
      // Use default estimates
      criterion.values.express = {
        score: 9,
        reason: "Team familiar with Express.js patterns",
        data: { estimated: true, experience: "high", learningCurve: "minimal" }
      };

      criterion.values.fastify = {
        score: 6,
        reason: "Team requires training on Fastify patterns",
        data: { estimated: true, experience: "low", learningCurve: "moderate" }
      };

      console.log('👥 Team Capability: Express.js (9), Fastify (6) - estimated values');
    }
  }

  /**
   * Evaluate competitive advantage criterion
   */
  evaluateCompetitiveAdvantage() {
    const criterion = this.criteria.competitiveAdvantage;
    const benchmark = this.scorecard.dataInputs.benchmark;

    if (benchmark) {
      const improvement = parseFloat(benchmark.performance?.requestsPerSecond?.improvement?.replace('%', '') || '0');
      
      criterion.values.express = {
        score: 5,
        reason: "Adequate performance for local development tool",
        data: { marketPosition: "acceptable", userExperience: "standard" }
      };

      criterion.values.fastify = {
        score: improvement > 50 ? 9 : improvement > 25 ? 7 : 6,
        reason: `${improvement}% performance advantage provides competitive edge`,
        data: { 
          marketPosition: "performance leader", 
          userExperience: "superior",
          improvement: `${improvement}%`
        }
      };

      console.log(`🏆 Competitive Advantage: Express.js (5), Fastify (${criterion.values.fastify.score})`);
    } else {
      criterion.values.express = {
        score: 5,
        reason: "Standard performance expected for development tools",
        data: { estimated: true }
      };

      criterion.values.fastify = {
        score: 8,
        reason: "Performance leadership in developer tools market",
        data: { estimated: true }
      };

      console.log('🏆 Competitive Advantage: Express.js (5), Fastify (8) - estimated values');
    }
  }

  /**
   * Calculate final weighted scores
   */
  calculateFinalScores() {
    let expressTotal = 0;
    let fastifyTotal = 0;

    Object.entries(this.criteria).forEach(([criterionName, criterion]) => {
      const expressScore = criterion.values.express.score * criterion.weight;
      const fastifyScore = criterion.values.fastify.score * criterion.weight;

      expressTotal += expressScore;
      fastifyTotal += fastifyScore;

      this.scorecard.scores.express.breakdown[criterionName] = {
        rawScore: criterion.values.express.score,
        weightedScore: expressScore,
        weight: criterion.weight
      };

      this.scorecard.scores.fastify.breakdown[criterionName] = {
        rawScore: criterion.values.fastify.score,
        weightedScore: fastifyScore,
        weight: criterion.weight
      };
    });

    this.scorecard.scores.express.total = Math.round(expressTotal * 10);
    this.scorecard.scores.fastify.total = Math.round(fastifyTotal * 10);
    this.scorecard.scores.express.weighted = expressTotal;
    this.scorecard.scores.fastify.weighted = fastifyTotal;

    console.log('\n📊 Final Weighted Scores:');
    console.log(`   Express.js: ${this.scorecard.scores.express.total}/100`);
    console.log(`   Fastify: ${this.scorecard.scores.fastify.total}/100`);
  }

  /**
   * Generate final recommendation
   */
  generateRecommendation() {
    const expressScore = this.scorecard.scores.express.total;
    const fastifyScore = this.scorecard.scores.fastify.total;
    const difference = Math.abs(fastifyScore - expressScore);

    // Determine recommendation
    if (fastifyScore > expressScore) {
      if (difference >= 15) {
        this.scorecard.recommendation = {
          choice: 'FASTIFY',
          confidence: 'HIGH',
          reasoning: `Fastify scores significantly higher (${fastifyScore} vs ${expressScore}). Performance and technical debt benefits justify migration effort.`
        };
      } else if (difference >= 8) {
        this.scorecard.recommendation = {
          choice: 'FASTIFY',
          confidence: 'MEDIUM',
          reasoning: `Fastify scores moderately higher (${fastifyScore} vs ${expressScore}). Consider team capacity and timeline constraints.`
        };
      } else {
        this.scorecard.recommendation = {
          choice: 'EXPRESS_ENHANCED',
          confidence: 'MEDIUM',
          reasoning: `Scores are close (${fastifyScore} vs ${expressScore}). Enhance Express.js to minimize risk while maintaining timeline.`
        };
      }
    } else {
      this.scorecard.recommendation = {
        choice: 'EXPRESS_ENHANCED',
        confidence: 'HIGH',
        reasoning: `Express.js scores higher or equal (${expressScore} vs ${fastifyScore}). Focus on optimizing current implementation.`
      };
    }

    // Add specific action items
    this.scorecard.recommendation.actionItems = this.generateActionItems();

    console.log(`\n🎯 RECOMMENDATION: ${this.scorecard.recommendation.choice}`);
    console.log(`   Confidence: ${this.scorecard.recommendation.confidence}`);
    console.log(`   Reasoning: ${this.scorecard.recommendation.reasoning}`);
  }

  /**
   * Generate specific action items based on recommendation
   */
  generateActionItems() {
    const choice = this.scorecard.recommendation.choice;

    switch (choice) {
      case 'FASTIFY':
        return [
          'Begin immediate Fastify migration (Week 1-2)',
          'Conduct comprehensive team training',
          'Set up parallel development tracks',
          'Implement comprehensive testing strategy',
          'Establish performance monitoring',
          'Plan rollback procedures'
        ];

      case 'EXPRESS_ENHANCED':
        return [
          'Implement production error handling middleware',
          'Add comprehensive performance monitoring', 
          'Optimize Express.js with clustering and caching',
          'Establish quality gates and automated testing',
          'Create comprehensive API documentation',
          'Plan future Fastify evaluation for v9.0.0'
        ];

      default:
        return [
          'Review evaluation criteria and data inputs',
          'Conduct additional team assessment',
          'Gather more performance benchmarking data',
          'Reassess timeline and resource constraints'
        ];
    }
  }

  /**
   * Save scorecard results
   */
  saveScorecard() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const scorecardPath = join(process.cwd(), `decision-scorecard-${timestamp}.json`);
    
    // Save detailed scorecard
    writeFileSync(scorecardPath, JSON.stringify(this.scorecard, null, 2));
    
    // Save summary for quick reference
    const summary = {
      timestamp: this.scorecard.timestamp,
      recommendation: this.scorecard.recommendation,
      scores: {
        express: this.scorecard.scores.express.total,
        fastify: this.scorecard.scores.fastify.total
      },
      dataQuality: {
        hasBenchmarkData: !!this.scorecard.dataInputs.benchmark,
        hasQualityData: !!this.scorecard.dataInputs.quality,
        hasTeamData: !!this.scorecard.dataInputs.team
      }
    };
    
    const summaryPath = join(process.cwd(), 'decision-summary.json');
    writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    console.log(`\n💾 Decision scorecard saved to: ${scorecardPath}`);
    console.log(`📋 Decision summary saved to: ${summaryPath}`);
  }

  /**
   * Generate detailed report
   */
  generateReport() {
    const recommendation = this.scorecard.recommendation;
    const expressScore = this.scorecard.scores.express.total;
    const fastifyScore = this.scorecard.scores.fastify.total;

    return `# Framework Decision Scorecard

**Generated:** ${this.scorecard.timestamp}

## Executive Summary

**RECOMMENDATION: ${recommendation.choice}**
**Confidence Level:** ${recommendation.confidence}

${recommendation.reasoning}

## Score Breakdown

| Framework | Total Score | Weighted Score |
|-----------|-------------|----------------|
| Express.js | ${expressScore}/100 | ${this.scorecard.scores.express.weighted.toFixed(2)} |
| Fastify | ${fastifyScore}/100 | ${this.scorecard.scores.fastify.weighted.toFixed(2)} |

## Detailed Evaluation

${Object.entries(this.criteria).map(([name, criterion]) => `
### ${name.replace(/([A-Z])/g, ' $1').trim()} (${(criterion.weight * 100).toFixed(0)}% weight)

**Threshold:** ${criterion.threshold}

**Express.js:** ${criterion.values.express.score}/10 - ${criterion.values.express.reason}
**Fastify:** ${criterion.values.fastify.score}/10 - ${criterion.values.fastify.reason}
`).join('\n')}

## Action Items

${recommendation.actionItems.map(item => `- ${item}`).join('\n')}

## Data Sources

- **Benchmark Data:** ${this.scorecard.dataInputs.benchmark ? '✅ Available' : '❌ Missing'}
- **Quality Gates:** ${this.scorecard.dataInputs.quality ? '✅ Available' : '❌ Missing'}  
- **Team Assessment:** ${this.scorecard.dataInputs.team ? '✅ Available' : '❌ Missing'}

## Next Steps

1. **Review Recommendation:** Share with stakeholders and team
2. **Validate Data:** Ensure all input data is accurate and current
3. **Plan Implementation:** Begin action items based on recommendation
4. **Monitor Progress:** Track implementation against success criteria

---

*Decision scorecard generated using data-driven evaluation framework*
*Confidence level based on data quality and score differential*
`;
  }
}

/**
 * Quick decision evaluation for immediate guidance
 */
export async function quickDecisionEvaluation() {
  console.log('⚡ Running quick decision evaluation...\n');
  
  const scorecard = new DecisionScorecard();
  
  // Load minimal data and provide quick assessment
  await scorecard.loadBenchmarkData();
  
  const hasGoodBenchmarkData = !!scorecard.scorecard.dataInputs.benchmark;
  
  if (hasGoodBenchmarkData) {
    const improvement = parseFloat(
      scorecard.scorecard.dataInputs.benchmark.performance?.requestsPerSecond?.improvement?.replace('%', '') || '0'
    );
    
    console.log(`📊 Performance improvement: ${improvement}%`);
    
    if (improvement > 50) {
      console.log('🚀 QUICK RECOMMENDATION: PROCEED WITH FASTIFY');
      console.log('   Reason: Significant performance improvement justifies migration');
    } else if (improvement > 25) {
      console.log('⚖️ QUICK RECOMMENDATION: DETAILED EVALUATION NEEDED');
      console.log('   Reason: Moderate improvement requires full criteria assessment');
    } else {
      console.log('🛡️ QUICK RECOMMENDATION: ENHANCE EXPRESS.JS');
      console.log('   Reason: Insufficient performance gain for migration complexity');
    }
  } else {
    console.log('📋 QUICK RECOMMENDATION: RUN BENCHMARKS FIRST');
    console.log('   Reason: Need performance data for informed decision');
  }
  
  console.log('\nFor complete evaluation, run: npm run decision:evaluate');
}

export { DecisionScorecard };
