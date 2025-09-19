/**
 * Authentication middleware for dashboard
 * Zero-trust local server with one-time token authentication
 */

import crypto from 'node:crypto';

let currentToken = null;

/**
 * Generate secure one-time token
 * @returns {string} Secure token
 */
export function generateToken() {
  currentToken = crypto.randomBytes(24).toString('base64url');
  return currentToken;
}

/**
 * Authentication middleware
 * @param {string} validToken Valid token for this session
 * @returns {Function} Express middleware
 */
export function authMiddleware(validToken) {
  return (req, res, next) => {
    // Get token from Authorization header or query parameter
    const authHeader = req.get('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const queryToken = req.query.t;

    const providedToken = headerToken || queryToken;

    if (!providedToken) {
      return res.status(401).json({
        code: 'MISSING_TOKEN',
        message: 'Authentication token required',
        hint: 'Provide token via Authorization header or ?t=token query parameter'
      });
    }

    if (providedToken !== validToken) {
      return res.status(401).json({
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
        hint: 'Use the token provided when dashboard was launched'
      });
    }

    // Token is valid, proceed to next middleware
    next();
  };
}

/**
 * Get current token (for internal use)
 * @returns {string|null} Current token
 */
export function getCurrentToken() {
  return currentToken;
}