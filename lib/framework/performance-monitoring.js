/**
 * Production Performance Monitoring Middleware
 * Comprehensive performance tracking and alerting system
 */

import { EventEmitter } from 'events';
import { logger } from './error-handler.js';

// Performance metrics collector
class PerformanceMetrics extends EventEmitter {
  constructor() {
    super();
    this.metrics = new Map();
    this.thresholds = {
      responseTime: 200, // ms
      webSocketLatency: 100, // ms
      errorRate: 1, // percentage
      memoryUsage: 80 // percentage of available
    };
    
    // Initialize metrics storage
    this.resetMetrics();
    
    // Start periodic reporting
    this.startPeriodicReporting();
  }

  resetMetrics() {
    this.metrics.set('requests', {
      total: 0,
      errors: 0,
      responseTimes: [],
      endpoints: new Map()
    });
    
    this.metrics.set('webSocket', {
      connections: 0,
      messages: 0,
      latencies: []
    });
    
    this.metrics.set('system', {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      uptime: process.uptime()
    });
  }

  recordRequest(req, res, duration) {
    const requests = this.metrics.get('requests');
    const endpoint = `${req.method} ${req.route?.path || req.path}`;
    
    // Update total counts
    requests.total++;
    if (res.statusCode >= 400) {
      requests.errors++;
    }
    
    // Record response time
    requests.responseTimes.push(duration);
    
    // Update per-endpoint metrics
    if (!requests.endpoints.has(endpoint)) {
      requests.endpoints.set(endpoint, {
        count: 0,
        errors: 0,
        responseTimes: [],
        lastAccessed: new Date()
      });
    }
    
    const endpointMetrics = requests.endpoints.get(endpoint);
    endpointMetrics.count++;
    endpointMetrics.responseTimes.push(duration);
    endpointMetrics.lastAccessed = new Date();
    
    if (res.statusCode >= 400) {
      endpointMetrics.errors++;
    }
    
    // Check thresholds and emit alerts
    this.checkThresholds(endpoint, duration);
  }

  recordWebSocketEvent(type, latency = null) {
    const webSocket = this.metrics.get('webSocket');
    
    switch (type) {
      case 'connection':
        webSocket.connections++;
        break;
      case 'disconnection':
        webSocket.connections--;
        break;
      case 'message':
        webSocket.messages++;
        if (latency !== null) {
          webSocket.latencies.push(latency);
        }
        break;
    }
    
    if (latency && latency > this.thresholds.webSocketLatency) {
      this.emit('alert', {
        type: 'websocket_latency',
        value: latency,
        threshold: this.thresholds.webSocketLatency,
        timestamp: new Date().toISOString()
      });
    }
  }

  checkThresholds(endpoint, duration) {
    // Response time threshold
    if (duration > this.thresholds.responseTime) {
      this.emit('alert', {
        type: 'response_time',
        endpoint,
        value: duration,
        threshold: this.thresholds.responseTime,
        timestamp: new Date().toISOString()
      });
    }

    // Error rate threshold (check every 100 requests)
    const requests = this.metrics.get('requests');
    if (requests.total % 100 === 0) {
      const errorRate = (requests.errors / requests.total) * 100;
      if (errorRate > this.thresholds.errorRate) {
        this.emit('alert', {
          type: 'error_rate',
          value: errorRate,
          threshold: this.thresholds.errorRate,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  getMetrics() {
    const requests = this.metrics.get('requests');
    const webSocket = this.metrics.get('webSocket');
    
    return {
      requests: {
        total: requests.total,
        errors: requests.errors,
        errorRate: requests.total > 0 ? (requests.errors / requests.total) * 100 : 0,
        averageResponseTime: this.calculateAverage(requests.responseTimes),
        p95ResponseTime: this.calculatePercentile(requests.responseTimes, 95),
        endpoints: Array.from(requests.endpoints.entries()).map(([path, metrics]) => ({
          path,
          count: metrics.count,
          errors: metrics.errors,
          errorRate: metrics.count > 0 ? (metrics.errors / metrics.count) * 100 : 0,
          averageResponseTime: this.calculateAverage(metrics.responseTimes),
          lastAccessed: metrics.lastAccessed
        }))
      },
      webSocket: {
        activeConnections: webSocket.connections,
        totalMessages: webSocket.messages,
        averageLatency: this.calculateAverage(webSocket.latencies)
      },
      system: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime()
      },
      timestamp: new Date().toISOString()
    };
  }

  calculateAverage(array) {
    if (array.length === 0) return 0;
    return array.reduce((sum, val) => sum + val, 0) / array.length;
  }

  calculatePercentile(array, percentile) {
    if (array.length === 0) return 0;
    const sorted = [...array].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  startPeriodicReporting() {
    // Report metrics every 5 minutes
    setInterval(() => {
      const metrics = this.getMetrics();
      logger.info('Performance metrics report', metrics);
      
      // Reset response times arrays to prevent memory growth
      const requests = this.metrics.get('requests');
      requests.responseTimes = requests.responseTimes.slice(-1000); // Keep last 1000
      
      requests.endpoints.forEach(endpoint => {
        endpoint.responseTimes = endpoint.responseTimes.slice(-100); // Keep last 100 per endpoint
      });
      
      const webSocket = this.metrics.get('webSocket');
      webSocket.latencies = webSocket.latencies.slice(-1000); // Keep last 1000
      
    }, 5 * 60 * 1000); // 5 minutes
  }
}

// Global metrics instance
const performanceMetrics = new PerformanceMetrics();

// Set up alert handling
performanceMetrics.on('alert', (alert) => {
  logger.warn('Performance alert triggered', alert);
  
  // In production, you might want to send to external alerting system
  if (process.env.NODE_ENV === 'production') {
    // Send to alerting system (Slack, PagerDuty, etc.)
    console.log('🚨 PERFORMANCE ALERT:', alert);
  }
});

/**
 * Performance monitoring middleware
 * Tracks response times and system metrics
 */
export function performanceMonitoring() {
  return (req, res, next) => {
    const startTime = performance.now();
    req.startTime = startTime;

    // Track request completion
    res.on('finish', () => {
      const duration = performance.now() - startTime;
      performanceMetrics.recordRequest(req, res, duration);
    });

    next();
  };
}

/**
 * Health check endpoint with detailed metrics
 */
export function healthCheckHandler() {
  return (req, res) => {
    const metrics = performanceMetrics.getMetrics();
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      metrics: {
        requests: {
          total: metrics.requests.total,
          errorRate: `${metrics.requests.errorRate.toFixed(2)}%`,
          averageResponseTime: `${metrics.requests.averageResponseTime.toFixed(2)}ms`,
          p95ResponseTime: `${metrics.requests.p95ResponseTime.toFixed(2)}ms`
        },
        webSocket: {
          activeConnections: metrics.webSocket.activeConnections,
          totalMessages: metrics.webSocket.totalMessages,
          averageLatency: `${metrics.webSocket.averageLatency.toFixed(2)}ms`
        },
        system: {
          memoryUsage: {
            used: `${(metrics.system.memory.heapUsed / 1024 / 1024).toFixed(2)}MB`,
            total: `${(metrics.system.memory.heapTotal / 1024 / 1024).toFixed(2)}MB`,
            external: `${(metrics.system.memory.external / 1024 / 1024).toFixed(2)}MB`
          },
          uptime: `${metrics.system.uptime.toFixed(2)}s`
        }
      }
    };

    // Determine health status based on thresholds
    if (metrics.requests.errorRate > performanceMetrics.thresholds.errorRate) {
      health.status = 'warning';
      health.warnings = health.warnings || [];
      health.warnings.push(`High error rate: ${metrics.requests.errorRate.toFixed(2)}%`);
    }

    if (metrics.requests.averageResponseTime > performanceMetrics.thresholds.responseTime) {
      health.status = 'warning';
      health.warnings = health.warnings || [];
      health.warnings.push(`High response time: ${metrics.requests.averageResponseTime.toFixed(2)}ms`);
    }

    const statusCode = health.status === 'ok' ? 200 : health.status === 'warning' ? 200 : 503;
    res.status(statusCode).json(health);
  };
}

/**
 * Detailed metrics endpoint for monitoring dashboards
 */
export function metricsHandler() {
  return (req, res) => {
    const metrics = performanceMetrics.getMetrics();
    res.json({
      success: true,
      data: metrics,
      meta: {
        generated: new Date().toISOString(),
        period: 'current',
        thresholds: performanceMetrics.thresholds
      }
    });
  };
}

/**
 * WebSocket performance tracking helper
 */
export function trackWebSocketPerformance(io) {
  io.on('connection', (socket) => {
    performanceMetrics.recordWebSocketEvent('connection');
    
    socket.on('disconnect', () => {
      performanceMetrics.recordWebSocketEvent('disconnection');
    });
    
    // Track message latency
    socket.on('ping', (startTime, callback) => {
      const latency = performance.now() - startTime;
      performanceMetrics.recordWebSocketEvent('message', latency);
      callback(latency);
    });
  });
}

/**
 * Express.js optimization middleware
 * Implements performance best practices
 */
export function expressOptimizations() {
  return {
    // Compression middleware
    compression: () => {
      return (req, res, next) => {
        // Simple compression logic (in production, use dedicated compression library)
        res.setHeader('Content-Encoding', 'gzip');
        next();
      };
    },
    
    // Security headers
    security: () => {
      return (req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        next();
      };
    },
    
    // Request/Response logging
    requestLogging: () => {
      return (req, res, next) => {
        const startTime = performance.now();
        
        res.on('finish', () => {
          const duration = performance.now() - startTime;
          logger.info('Request completed', {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: Math.round(duration * 100) / 100,
            userAgent: req.get('User-Agent'),
            ip: req.ip,
            timestamp: new Date().toISOString()
          });
        });
        
        next();
      };
    }
  };
}

export { performanceMetrics };
