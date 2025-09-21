/**
 * Production-Grade Error Handling Middleware
 * Addresses recurring Express.js error patterns with structured logging
 */

import { v4 as uuidv4 } from 'uuid';
import { createLogger, format, transports } from 'winston';

// Create structured logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'runlintic-dashboard' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

/**
 * Global error handling middleware
 * Implements production-ready error handling with correlation IDs
 */
export function globalErrorHandler() {
  return (error, req, res) => {
    const errorId = uuidv4();
    const startTime = req.startTime || Date.now();
    const duration = Date.now() - startTime;

    // Log structured error information
    logger.error('Global error handler triggered', {
      errorId,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code,
        statusCode: error.statusCode
      },
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        duration
      },
      timestamp: new Date().toISOString()
    });

    // Determine error status code
    const statusCode = error.statusCode || error.status || 500;

    // Create standardized error response
    const errorResponse = {
      success: false,
      error: {
        code: error.code || 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
        errorId,
        timestamp: new Date().toISOString()
      },
      meta: {
        duration,
        endpoint: `${req.method} ${req.path}`,
        version: process.env.npm_package_version || '1.0.0'
      }
    };

    // Add debug information in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.debug = {
        stack: error.stack,
        request: {
          headers: req.headers,
          body: req.body,
          params: req.params,
          query: req.query
        }
      };
    }

    // Send error response
    res.status(statusCode).json(errorResponse);
  };
}

/**
 * Async error wrapper for route handlers
 * Eliminates need for try/catch in every async route
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 handler for undefined routes
 * Standardized not found responses
 */
export function notFoundHandler() {
  return (req, res) => {
    const errorId = uuidv4();
    
    logger.warn('Route not found', {
      errorId,
      request: {
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      },
      timestamp: new Date().toISOString()
    });

    res.status(404).json({
      success: false,
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: `Route ${req.method} ${req.path} not found`,
        errorId,
        timestamp: new Date().toISOString()
      },
      meta: {
        endpoint: `${req.method} ${req.path}`,
        availableRoutes: [
          'GET /api/health',
          'POST /api/health/run',
          'GET /api/project/context',
          'GET /api/dependencies/stats'
        ]
      }
    });
  };
}

/**
 * Request validation error handler
 * Handles validation errors with detailed field information
 */
export function validationErrorHandler() {
  return (error, req, res, next) => {
    if (error.name === 'ValidationError' || error.type === 'validation') {
      const errorId = uuidv4();
      
      logger.warn('Validation error', {
        errorId,
        validationErrors: error.details || error.errors,
        request: {
          method: req.method,
          url: req.url,
          body: req.body
        },
        timestamp: new Date().toISOString()
      });

      const validationResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          errorId,
          timestamp: new Date().toISOString()
        },
        validation: {
          errors: error.details || error.errors || [],
          field: error.field || null
        },
        meta: {
          endpoint: `${req.method} ${req.path}`
        }
      };

      return res.status(400).json(validationResponse);
    }

    // Pass to global error handler if not validation error
    next(error);
  };
}

/**
 * Rate limiting error handler
 * Custom handler for rate limit exceeded responses
 */
export function rateLimitErrorHandler() {
  return (req, res) => {
    const errorId = uuidv4();
    
    logger.warn('Rate limit exceeded', {
      errorId,
      request: {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: `${req.method} ${req.path}`
      },
      timestamp: new Date().toISOString()
    });

    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
        errorId,
        timestamp: new Date().toISOString()
      },
      meta: {
        retryAfter: '15 minutes',
        endpoint: `${req.method} ${req.path}`
      }
    });
  };
}

/**
 * Graceful shutdown handler
 * Ensures proper cleanup on application termination
 */
export function setupGracefulShutdown(server) {
  const shutdown = (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    server.close((err) => {
      if (err) {
        logger.error('Error during server shutdown', { error: err.message });
        process.exit(1);
      }
      
      logger.info('Server closed successfully');
      process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

export { logger };
