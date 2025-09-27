/**
 * API Service Layer for Runlintic Dashboard
 * Connects React frontend to Express.js backend endpoints
 */

class APIService {
  constructor() {
    this.baseURL = '';  // Same origin since served by Express.js
    this.token = this.getTokenFromURL();
  }

  /**
   * Extract token from URL parameters for authentication
   */
  getTokenFromURL() {
    // Check if running in browser environment
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('t') || '';
    }
    return '';
  }

  /**
   * Make authenticated API requests
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authentication token
    if (this.token) {
      config.headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Health Check Endpoints
   */
  async getHealth() {
    return this.request('/health');
  }

  async runHealthCheck() {
    return this.request('/health/run', { method: 'POST' });
  }

  /**
   * Project Context Endpoints
   */
  async getProjectContext() {
    return this.request('/project/context');
  }

  async getProjectStats() {
    return this.request('/project/stats');
  }

  /**
   * Dependencies Endpoints
   */
  async getDependencyStats() {
    return this.request('/dependencies/stats');
  }

  async analyzeDependencies(options = {}) {
    return this.request('/dependencies/analyze', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  /**
   * Git Operations Endpoints
   */
  async getGitStatus() {
    return this.request('/git/status');
  }

  async getGitInfo() {
    return this.request('/git/info');
  }

  /**
   * Framework Decision Endpoints (if implemented)
   */
  async getFrameworkMetrics() {
    try {
      return this.request('/framework/metrics');
    } catch (error) {
      // Framework endpoints might not be implemented yet
      console.warn('Framework metrics endpoint not available:', error.message);
      return null;
    }
  }

  async runFrameworkBenchmark() {
    try {
      return this.request('/framework/benchmark', { method: 'POST' });
    } catch (error) {
      console.warn('Framework benchmark endpoint not available:', error.message);
      return null;
    }
  }

  /**
   * Real-time status checking
   */
  async getSystemStatus() {
    try {
      const [health, project, dependencies] = await Promise.allSettled([
        this.getHealth(),
        this.getProjectContext(),
        this.getDependencyStats(),
      ]);

      return {
        health: health.status === 'fulfilled' ? health.value : null,
        project: project.status === 'fulfilled' ? project.value : null,
        dependencies: dependencies.status === 'fulfilled' ? dependencies.value : null,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to get system status:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new APIService();