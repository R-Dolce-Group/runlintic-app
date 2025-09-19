/**
 * Dashboard server entry point
 * Express.js server for runlintic admin dashboard
 */

import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateToken, authMiddleware } from './middleware/auth.js';
import { setupRoutes } from './routes/index.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * Start dashboard server
 * @param {Object} options Server options
 * @returns {Promise<Object>} Server info
 */
export async function startDashboard(options = {}) {
  const {
    port = 0,
    host = '127.0.0.1',
    project = process.cwd(),
    autoOpen = true
  } = options;

  console.log('🎯 Starting runlintic dashboard server...');
  console.log(`📁 Project: ${project}`);

  const app = express();
  const server = createServer(app);

  // Security middleware
  app.use(cors({
    origin: `http://${host}:${port}`,
    credentials: false
  }));

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Generate one-time token for security
  const token = generateToken();
  console.log('🔐 Generated secure access token');

  // Apply authentication middleware to API routes
  app.use('/api', authMiddleware(token));

  // Setup API routes
  setupRoutes(app, { projectRoot: project });

  // Serve dashboard static assets (when built)
  const dashboardPath = path.join(dirname, '..', 'dashboard', 'dist');
  app.use(express.static(dashboardPath));

  // Fallback to index.html for SPA routing
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }

    // For now, return a simple HTML page until dashboard is built
    res.send(createTemporaryDashboard(token));
  });

  // Start server
  const actualPort = await new Promise((resolve, reject) => {
    server.listen(port, host, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(server.address().port);
      }
    });
  });

  const url = `http://${host}:${actualPort}/?t=${token}`;

  console.log(`🚀 Dashboard server running at: ${url}`);
  console.log(`🔒 Secure token: ${token}`);
  console.log(`📊 API endpoints available at: http://${host}:${actualPort}/api`);

  // Auto-open browser if requested
  if (autoOpen) {
    const { default: open } = await import('open');
    await open(url);
    console.log('🌐 Dashboard opened in browser');
  }

  console.log('\n💡 Dashboard is ready! Press Ctrl+C to stop.');

  return {
    server,
    url,
    token,
    port: actualPort,
    host
  };
}

/**
 * Create temporary dashboard HTML until React app is built
 * @param {string} token Access token
 * @returns {string} HTML content
 */
function createTemporaryDashboard(token) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Runlintic Dashboard</title>
    <style>
        :root {
            --runlintic-orange: #f97316;
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

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .logo {
            font-size: 2.5rem;
            font-weight: bold;
            color: var(--runlintic-orange);
            margin-bottom: 1rem;
        }

        .status {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: #dcfce7;
            color: #166534;
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

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .endpoint {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: var(--slate-50);
            border-radius: 0.5rem;
            margin-bottom: 1rem;
        }

        .method {
            font-weight: bold;
            padding: 0.25rem 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
        }

        .get { background: #dbeafe; color: #1e40af; }
        .post { background: #fef3c7; color: #92400e; }

        .btn {
            background: var(--runlintic-orange);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }

        .btn:hover {
            opacity: 0.9;
        }

        .info {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-top: 2rem;
        }

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
            <div class="logo">🚀 Runlintic Dashboard</div>
            <div class="status">
                <span>✅</span>
                <span>Server Running</span>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h2>📊 API Endpoints</h2>
                <p>Test the dashboard API endpoints:</p>

                <div class="endpoint">
                    <div>
                        <span class="method get">GET</span>
                        <code>/api/health</code>
                    </div>
                    <button class="btn" onclick="testAPI('/api/health')">Test</button>
                </div>

                <div class="endpoint">
                    <div>
                        <span class="method post">POST</span>
                        <code>/api/health/run</code>
                    </div>
                    <button class="btn" onclick="testAPI('/api/health/run', 'POST')">Test</button>
                </div>

                <div class="endpoint">
                    <div>
                        <span class="method get">GET</span>
                        <code>/api/project/context</code>
                    </div>
                    <button class="btn" onclick="testAPI('/api/project/context')">Test</button>
                </div>

                <div id="api-result" style="margin-top: 1rem; padding: 1rem; background: #f8fafc; border-radius: 0.5rem; display: none;">
                    <h4>API Response:</h4>
                    <pre id="api-output" style="white-space: pre-wrap; font-size: 0.875rem;"></pre>
                </div>
            </div>

            <div class="card">
                <h2>🏗️ Development Status</h2>
                <p>Dashboard implementation progress:</p>

                <div style="margin: 1.5rem 0;">
                    <div style="margin-bottom: 0.5rem;">
                        <strong>✅ Phase 1: Foundation</strong>
                        <div style="font-size: 0.875rem; color: #6b7280;">CLI integration, core architecture</div>
                    </div>

                    <div style="margin-bottom: 0.5rem;">
                        <strong>🔄 Phase 2: React Dashboard</strong>
                        <div style="font-size: 0.875rem; color: #6b7280;">Building interactive UI components</div>
                    </div>

                    <div style="margin-bottom: 0.5rem;">
                        <strong>⏳ Phase 3: Real-time Features</strong>
                        <div style="font-size: 0.875rem; color: #6b7280;">WebSocket integration, live updates</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="info">
            <h3>🔒 Security Information</h3>
            <p>This dashboard server runs locally with token-based authentication. Your access token is: <code>${token}</code></p>
            <p>All API requests require the token in the Authorization header or as a query parameter.</p>
        </div>
    </div>

    <script>
        const token = '${token}';

        async function testAPI(endpoint, method = 'GET') {
            const resultDiv = document.getElementById('api-result');
            const outputPre = document.getElementById('api-output');

            try {
                const response = await fetch(endpoint + '?t=' + token, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                outputPre.textContent = JSON.stringify(data, null, 2);
                resultDiv.style.display = 'block';
            } catch (error) {
                outputPre.textContent = 'Error: ' + error.message;
                resultDiv.style.display = 'block';
            }
        }
    </script>
</body>
</html>`;
}