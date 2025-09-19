/**
 * Dependencies API routes
 * Provides dependency analysis and management
 */

import { Router } from 'express';
import { DependencyAnalyzer } from '../../core/dependency-analyzer.js';

/**
 * Create dependency routes
 * @param {Object} options Route options
 * @returns {Router} Express router
 */
export function dependencyRoutes(options = {}) {
  const { projectRoot = process.cwd() } = options;
  const router = Router();
  const dependencyAnalyzer = new DependencyAnalyzer(projectRoot);

  /**
   * GET /api/dependencies/stats
   * Get dependency statistics
   */
  router.get('/stats', async (req, res) => {
    try {
      const stats = await dependencyAnalyzer.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get dependency stats',
        message: error.message
      });
    }
  });

  /**
   * POST /api/dependencies/analyze
   * Run comprehensive dependency analysis
   */
  router.post('/analyze', async (req, res) => {
    try {
      const { focus } = req.body;
      const result = await dependencyAnalyzer.analyzeComprehensive({ focus });
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: 'Dependency analysis failed',
        message: error.message
      });
    }
  });

  /**
   * GET /api/dependencies/security
   * Run security-focused analysis
   */
  router.get('/security', async (req, res) => {
    try {
      const result = await dependencyAnalyzer.analyzeSecurity();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: 'Security analysis failed',
        message: error.message
      });
    }
  });

  /**
   * GET /api/dependencies/updates
   * Get available updates
   */
  router.get('/updates', async (req, res) => {
    try {
      const result = await dependencyAnalyzer.analyzeUpdates();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: 'Updates analysis failed',
        message: error.message
      });
    }
  });

  /**
   * GET /api/dependencies/health
   * Run dependency health check
   */
  router.get('/health', async (req, res) => {
    try {
      const result = await dependencyAnalyzer.analyzeHealth();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: 'Dependency health check failed',
        message: error.message
      });
    }
  });

  return router;
}