/**
 * Git operations API routes
 * Provides git status, commit generation, and repository management
 */

import { Router } from 'express';
import { GitOperations } from '../../core/git-operations.js';

/**
 * Create git routes
 * @param {Object} options Route options
 * @returns {Router} Express router
 */
export function gitRoutes(options = {}) {
  const { projectRoot = process.cwd() } = options;
  const router = Router();
  const gitOps = new GitOperations(projectRoot);

  /**
   * GET /api/git/status
   * Get git repository status
   */
  router.get('/status', async (req, res) => {
    try {
      const status = await gitOps.getStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get git status',
        message: error.message
      });
    }
  });

  /**
   * POST /api/git/commit/generate
   * Generate conventional commit message
   */
  router.post('/commit/generate', async (req, res) => {
    try {
      const result = await gitOps.generateCommit(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to generate commit',
        message: error.message
      });
    }
  });

  /**
   * POST /api/git/commit/create
   * Create commit with message
   */
  router.post('/commit/create', async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          error: 'Commit message required',
          message: 'Please provide a commit message in the request body'
        });
      }

      const result = await gitOps.createCommit(message);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to create commit',
        message: error.message
      });
    }
  });

  /**
   * GET /api/git/commits
   * Get recent commits
   */
  router.get('/commits', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const commits = await gitOps.getRecentCommits(limit);
      res.json({
        commits,
        count: commits.length,
        limit
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get commits',
        message: error.message
      });
    }
  });

  return router;
}