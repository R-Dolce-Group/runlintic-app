/**
 * API routes setup
 * Central routing configuration for dashboard API
 */

import { healthRoutes } from './health.js';
import { projectRoutes } from './project.js';
import { dependencyRoutes } from './dependencies.js';
import { gitRoutes } from './git.js';

/**
 * Setup all API routes
 * @param {Object} app Express app instance
 * @param {Object} options Route options
 */
export function setupRoutes(app, options = {}) {
  const { projectRoot = process.cwd() } = options;

  // Pass projectRoot context to all route handlers
  const routeOptions = { projectRoot };

  // Setup route groups
  app.use('/api/health', healthRoutes(routeOptions));
  app.use('/api/project', projectRoutes(routeOptions));
  app.use('/api/dependencies', dependencyRoutes(routeOptions));
  app.use('/api/git', gitRoutes(routeOptions));

  // API info endpoint
  app.get('/api', (req, res) => {
    res.json({
      name: 'runlintic-dashboard-api',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        project: '/api/project',
        dependencies: '/api/dependencies',
        git: '/api/git'
      },
      documentation: 'https://github.com/R-Dolce-Group/runlintic-app',
      timestamp: new Date().toISOString()
    });
  });
}