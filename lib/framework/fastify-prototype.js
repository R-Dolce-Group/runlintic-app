/**
 * Fastify Prototype Implementation
 * Week 2 evaluation prototype for performance benchmarking
 */

import Fastify from 'fastify';
import { randomBytes } from 'node:crypto';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import compress from '@fastify/compress';

/**
 * Fastify prototype server setup
 * Implements same functionality as Express.js version for comparison
 */
class FastifyPrototype {
  constructor(options = {}) {
    this.fastify = Fastify({
      logger: {
        level: process.env.LOG_LEVEL || 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true
          }
        }
      },
      requestTimeout: 30000,
      bodyLimit: 1048576 // 1MB
    });
    
    this.token = null;
    this.setupPlugins();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  async setupPlugins() {
    // CORS plugin
    await this.fastify.register(cors, {
      origin: true,
      credentials: false
    });

    // Rate limiting
    await this.fastify.register(rateLimit, {
      max: 100,
      timeWindow: '15 minutes'
    });

    // Compression
    await this.fastify.register(compress, {
      global: true
    });
  }

  setupRoutes() {
    // Generate secure token
    this.token = randomBytes(24).toString('base64url');

    // Authentication hook
    this.fastify.addHook('preHandler', async (request, reply) => {
      // Skip auth for non-API routes
      if (!request.url.startsWith('/api')) {
        return;
      }

      const authHeader = request.headers.authorization;
      const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
      const queryToken = request.query.t;
      const providedToken = headerToken || queryToken;

      if (!providedToken || providedToken !== this.token) {
        reply.status(401).send({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication token required',
            timestamp: new Date().toISOString()
          }
        });
        return;
      }
    });

    // Health check endpoint with schema validation
    this.fastify.get('/api/health', {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  uptime: { type: 'number' },
                  memory: { type: 'object' },
                  timestamp: { type: 'string' }
                }
              },
              meta: { type: 'object' }
            }
          }
        }
      }
    }, async (request, reply) => {
      const startTime = process.hrtime.bigint();
      
      try {
        const memoryUsage = process.memoryUsage();
        const result = {
          success: true,
          data: {
            status: 'ok',
            uptime: process.uptime(),
            memory: {
              used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
              total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
              external: Math.round(memoryUsage.external / 1024 / 1024)
            },
            version: process.env.npm_package_version || '1.0.0',
            timestamp: new Date().toISOString()
          },
          meta: {
            responseTime: Number(process.hrtime.bigint() - startTime) / 1000000,
            endpoint: 'GET /api/health'
          }
        };

        return result;
      } catch (error) {
        reply.status(500).send({
          success: false,
          error: {
            code: 'HEALTH_CHECK_FAILED',
            message: 'Health check failed',
            timestamp: new Date().toISOString()
          }
        });
      }
    });

    // Comprehensive health check
    this.fastify.post('/api/health/run', {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  overall: { type: 'object' },
                  checks: { type: 'object' },
                  timestamp: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }, async (request, reply) => {
      const startTime = process.hrtime.bigint();
      
      try {
        // Simulate comprehensive health checks
        const checks = await this.runHealthChecks();
        const overallScore = this.calculateHealthScore(checks);
        
        const result = {
          success: true,
          data: {
            overall: {
              score: overallScore,
              status: overallScore >= 80 ? 'healthy' : overallScore >= 60 ? 'warning' : 'critical'
            },
            checks,
            timestamp: new Date().toISOString()
          },
          meta: {
            responseTime: Number(process.hrtime.bigint() - startTime) / 1000000,
            endpoint: 'POST /api/health/run'
          }
        };

        return result;
      } catch (error) {
        reply.status(500).send({
          success: false,
          error: {
            code: 'HEALTH_RUN_FAILED',
            message: 'Comprehensive health check failed',
            timestamp: new Date().toISOString()
          }
        });
      }
    });

    // Project context endpoint
    this.fastify.get('/api/project/context', {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  projectRoot: { type: 'string' },
                  projectType: { type: 'string' },
                  hasPackageJson: { type: 'boolean' },
                  frameworks: { type: 'array' }
                }
              }
            }
          }
        }
      }
    }, async (request, reply) => {
      const startTime = process.hrtime.bigint();
      
      try {
        const context = {
          projectRoot: process.cwd(),
          projectType: 'node.js',
          hasPackageJson: true,
          frameworks: ['express', 'fastify'],
          timestamp: new Date().toISOString()
        };

        return {
          success: true,
          data: context,
          meta: {
            responseTime: Number(process.hrtime.bigint() - startTime) / 1000000,
            endpoint: 'GET /api/project/context'
          }
        };
      } catch (error) {
        reply.status(500).send({
          success: false,
          error: {
            code: 'PROJECT_CONTEXT_FAILED',
            message: 'Failed to get project context',
            timestamp: new Date().toISOString()
          }
        });
      }
    });

    // Dependency analysis endpoint
    this.fastify.post('/api/dependencies/analyze', {
      schema: {
        body: {
          type: 'object',
          properties: {
            focus: { type: 'string', enum: ['security', 'updates', 'unused', 'all'] }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: { type: 'object' }
            }
          }
        }
      }
    }, async (request, reply) => {
      const startTime = process.hrtime.bigint();
      const { focus = 'all' } = request.body;
      
      try {
        // Simulate dependency analysis
        const analysis = await this.runDependencyAnalysis(focus);
        
        return {
          success: true,
          data: analysis,
          meta: {
            responseTime: Number(process.hrtime.bigint() - startTime) / 1000000,
            endpoint: 'POST /api/dependencies/analyze',
            focus
          }
        };
      } catch (error) {
        reply.status(500).send({
          success: false,
          error: {
            code: 'DEPENDENCY_ANALYSIS_FAILED',
            message: 'Dependency analysis failed',
            timestamp: new Date().toISOString()
          }
        });
      }
    });

    // Root endpoint
    this.fastify.get('/', async (request, reply) => {
      reply.type('text/html').send(this.createTemporaryDashboard());
    });

    // Catch-all for SPA routing
    this.fastify.setNotFoundHandler(async (request, reply) => {
      if (request.url.startsWith('/api')) {
        reply.status(404).send({
          success: false,
          error: {
            code: 'API_ENDPOINT_NOT_FOUND',
            message: `API endpoint ${request.method} ${request.url} not found`,
            timestamp: new Date().toISOString()
          },
          meta: {
            availableEndpoints: [
              'GET /api/health',
              'POST /api/health/run',
              'GET /api/project/context',
              'POST /api/dependencies/analyze'
            ]
          }
        });
      } else {
        reply.type('text/html').send(this.createTemporaryDashboard());
      }
    });
  }

  setupErrorHandling() {
    this.fastify.setErrorHandler(async (error, request, reply) => {
      const errorId = randomBytes(16).toString('hex');
      
      this.fastify.log.error('Fastify error handler', {
        errorId,
        error: error.message,
        stack: error.stack,
        request: {
          method: request.method,
          url: request.url
        }
      });

      const statusCode = error.statusCode || 500;
      
      reply.status(statusCode).send({
        success: false,
        error: {
          code: error.code || 'INTERNAL_ERROR',
          message: error.message || 'Internal server error',
          errorId,
          timestamp: new Date().toISOString()
        },
        meta: {
          endpoint: `${request.method} ${request.url}`
        }
      });
    });
  }

  async runHealthChecks() {
    // Simulate various health checks
    return {
      api: {
        status: 'healthy',
        responseTime: Math.random() * 50 + 10, // 10-60ms
        endpointsUp: 4,
        endpointsTotal: 4
      },
      database: {
        status: 'healthy',
        connectionTime: Math.random() * 20 + 5, // 5-25ms
        queriesPerSecond: Math.random() * 100 + 50
      },
      dependencies: {
        status: 'healthy',
        totalPackages: 127,
        vulnerabilities: 0,
        outdated: 3
      }
    };
  }

  calculateHealthScore(checks) {
    const scores = [];
    
    Object.values(checks).forEach(check => {
      if (check.status === 'healthy') scores.push(100);
      else if (check.status === 'warning') scores.push(70);
      else scores.push(30);
    });
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  async runDependencyAnalysis(focus) {
    // Simulate dependency analysis based on focus
    const baseAnalysis = {
      timestamp: new Date().toISOString(),
      totalPackages: 127,
      analysisTime: Math.random() * 1000 + 500 // 500-1500ms
    };

    switch (focus) {
      case 'security':
        return {
          ...baseAnalysis,
          vulnerabilities: {
            critical: 0,
            high: 1,
            medium: 2,
            low: 5
          },
          recommendations: [
            'Update lodash to fix medium vulnerability',
            'Review high severity package: old-package@1.0.0'
          ]
        };
        
      case 'updates':
        return {
          ...baseAnalysis,
          outdated: {
            patch: 15,
            minor: 8,
            major: 3
          },
          recommendations: [
            'Safe patch updates available for 15 packages',
            'Consider minor updates for development dependencies'
          ]
        };
        
      case 'unused':
        return {
          ...baseAnalysis,
          unused: [
            'unused-package-1',
            'old-dev-dependency'
          ],
          recommendations: [
            'Remove 2 unused dependencies to reduce bundle size'
          ]
        };
        
      default:
        return {
          ...baseAnalysis,
          summary: {
            vulnerabilities: 8,
            outdated: 26,
            unused: 2
          },
          score: 85,
          recommendations: [
            'Address high severity vulnerability',
            'Update patch-level dependencies',
            'Remove unused packages'
          ]
        };
    }
  }

  createTemporaryDashboard() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Runlintic Dashboard - Fastify Prototype</title>
    <style>
        :root {
            --fastify-blue: #0056cc;
            --success-green: #10b981;
            --slate-50: #f8fafc;
            --slate-900: #0f172a;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--slate-50);
            color: var(--slate-900);
            line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .header { text-align: center; margin-bottom: 3rem; }
        .logo {
            font-size: 2.5rem;
            font-weight: bold;
            color: var(--fastify-blue);
            margin-bottom: 1rem;
        }
        .prototype-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--success-green);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-weight: 500;
        }
        .card {
            background: white;
            border-radius: 0.75rem;
            padding: 2rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        .performance-comparison {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin: 2rem 0;
        }
        .metric {
            padding: 1rem;
            background: var(--slate-50);
            border-radius: 0.5rem;
            text-align: center;
        }
        .metric-value {
            font-size: 2rem;
            font-weight: bold;
            color: var(--fastify-blue);
        }
        .btn {
            background: var(--fastify-blue);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            cursor: pointer;
            margin: 0.5rem;
        }
        .btn:hover { opacity: 0.9; }
        code {
            background: #f1f5f9;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-family: 'SF Mono', Consolas, monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⚡ Fastify Prototype</div>
            <div class="prototype-badge">
                <span>🚀</span>
                <span>Performance Evaluation Mode</span>
            </div>
        </div>

        <div class="card">
            <h2>🎯 Prototype Evaluation Dashboard</h2>
            <p>This Fastify prototype implements the same functionality as the Express.js version for direct performance comparison.</p>
            
            <div class="performance-comparison">
                <div class="metric">
                    <div class="metric-value" id="response-time">--</div>
                    <div>Avg Response Time (ms)</div>
                </div>
                <div class="metric">
                    <div class="metric-value" id="requests-per-second">--</div>
                    <div>Requests/Second</div>
                </div>
            </div>

            <h3>📊 API Endpoints (Fastify)</h3>
            <button class="btn" onclick="testAPI('/api/health')">Test Health Check</button>
            <button class="btn" onclick="testAPI('/api/health/run', 'POST')">Run Comprehensive Health</button>
            <button class="btn" onclick="testAPI('/api/project/context')">Test Project Context</button>
            <button class="btn" onclick="testAPI('/api/dependencies/analyze', 'POST', {focus: 'security'})">Test Dependency Analysis</button>
            
            <div id="results" style="margin-top: 2rem; padding: 1rem; background: #f8fafc; border-radius: 0.5rem; display: none;">
                <h4>Latest Test Results:</h4>
                <pre id="output" style="white-space: pre-wrap; font-size: 0.875rem;"></pre>
            </div>
        </div>

        <div class="card">
            <h2>⚡ Performance Metrics</h2>
            <p>Real-time performance tracking for benchmarking comparison:</p>
            
            <div style="margin: 1rem 0;">
                <strong>Schema Validation:</strong> ✅ Built-in JSON Schema validation<br>
                <strong>Error Handling:</strong> ✅ Structured error responses<br>
                <strong>Request Logging:</strong> ✅ Pino high-performance logging<br>
                <strong>Compression:</strong> ✅ Built-in compression middleware<br>
                <strong>Rate Limiting:</strong> ✅ Built-in rate limiting
            </div>
        </div>
    </div>

    <script>
        const token = '${this.token}';
        let requestCount = 0;
        let totalResponseTime = 0;

        async function testAPI(endpoint, method = 'GET', body = null) {
            const resultsDiv = document.getElementById('results');
            const outputPre = document.getElementById('output');
            
            const startTime = performance.now();
            requestCount++;

            try {
                const options = {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${token}\`
                    }
                };

                if (body) {
                    options.body = JSON.stringify(body);
                }

                const response = await fetch(endpoint, options);
                const data = await response.json();
                const responseTime = performance.now() - startTime;
                
                totalResponseTime += responseTime;
                const avgResponseTime = totalResponseTime / requestCount;
                
                // Update metrics
                document.getElementById('response-time').textContent = avgResponseTime.toFixed(1);
                document.getElementById('requests-per-second').textContent = (1000 / avgResponseTime).toFixed(1);
                
                outputPre.textContent = JSON.stringify({
                    endpoint: \`\${method} \${endpoint}\`,
                    responseTime: \`\${responseTime.toFixed(2)}ms\`,
                    status: response.status,
                    data: data
                }, null, 2);
                
                resultsDiv.style.display = 'block';
            } catch (error) {
                outputPre.textContent = 'Error: ' + error.message;
                resultsDiv.style.display = 'block';
            }
        }

        // Auto-test on load
        setTimeout(() => {
            testAPI('/api/health');
        }, 1000);
    </script>
</body>
</html>`;
  }

  async start(options = {}) {
    const { port = 0, host = '127.0.0.1', autoOpen = true } = options;
    
    try {
      const address = await this.fastify.listen({ port, host });
      const actualPort = this.fastify.server.address().port;
      const url = `http://${host}:${actualPort}/?t=${this.token}`;
      
      this.fastify.log.info(`🚀 Fastify prototype running at: ${url}`);
      this.fastify.log.info(`🔒 Secure token: ${this.token}`);
      
      if (autoOpen) {
        const { default: open } = await import('open');
        await open(url);
        this.fastify.log.info('🌐 Prototype dashboard opened in browser');
      }
      
      return {
        server: this.fastify.server,
        url,
        token: this.token,
        port: actualPort,
        host
      };
    } catch (err) {
      this.fastify.log.error(err);
      process.exit(1);
    }
  }

  async close() {
    await this.fastify.close();
  }
}

export { FastifyPrototype };

/**
 * Start Fastify prototype server
 * @param {Object} options Server options
 * @returns {Promise<Object>} Server info
 */
export async function startFastifyPrototype(options = {}) {
  const prototype = new FastifyPrototype();
  return await prototype.start(options);
}
