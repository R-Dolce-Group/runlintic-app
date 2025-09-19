/**
 * Project context API routes
 * Provides project information and configuration
 */

import { Router } from 'express';
import path from 'path';
import { ProjectDetector } from '../../core/project-detector.js';

/**
 * Create project routes
 * @param {Object} options Route options
 * @returns {Router} Express router
 */
export function projectRoutes(options = {}) {
  const { projectRoot = process.cwd() } = options;
  const router = Router();
  const projectDetector = new ProjectDetector(projectRoot);

  /**
   * GET /api/project/context
   * Get project context and configuration
   */
  router.get('/context', async (req, res) => {
    try {
      const context = projectDetector.detectProjectContext();
      res.json(context);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to detect project context',
        message: error.message
      });
    }
  });

  /**
   * GET /api/project/info
   * Get basic project information
   */
  router.get('/info', async (req, res) => {
    try {
      const context = projectDetector.detectProjectContext();

      res.json({
        name: path.basename(projectRoot),
        root: projectRoot,
        type: context.projectType,
        frameworks: context.frameworks,
        isMonorepo: context.isMonorepo,
        hasGit: context.hasGit,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get project info',
        message: error.message
      });
    }
  });

  return router;
}