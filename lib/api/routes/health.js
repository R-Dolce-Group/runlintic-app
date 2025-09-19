/**
 * Health check API routes
 * Provides project health status and health check operations
 */

import { Router } from 'express';
import { HealthChecker } from '../../core/health-checker.js';

/**
 * Create health routes
 * @param {Object} options Route options
 * @returns {Router} Express router
 */
export function healthRoutes(options = {}) {
  const { projectRoot = process.cwd() } = options;
  const router = Router();
  const healthChecker = new HealthChecker(projectRoot);

  /**
   * GET /api/health
   * Get current health status
   */
  router.get('/', async (req, res) => {
    try {
      // For quick status, return cached/basic info
      res.json({
        status: 'online',
        project: projectRoot,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get health status',
        message: error.message
      });
    }
  });

  /**
   * POST /api/health/run
   * Run comprehensive health check
   */
  router.post('/run', async (req, res) => {
    try {
      const result = await healthChecker.runHealthCheck();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: 'Health check failed',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  /**
   * GET /api/health/lint
   * Run lint check only
   */
  router.get('/lint', async (req, res) => {
    try {
      const result = await healthChecker.runLint();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: 'Lint check failed',
        message: error.message
      });
    }
  });

  /**
   * GET /api/health/typecheck
   * Run type check only
   */
  router.get('/typecheck', async (req, res) => {
    try {
      const result = await healthChecker.runTypeCheck();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: 'Type check failed',
        message: error.message
      });
    }
  });

  return router;
}