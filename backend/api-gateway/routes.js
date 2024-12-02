const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = express.Router();

// Proxy configuration for User Service
router.use(
  '/signup',
  createProxyMiddleware({
    target: 'http://user-service:3001',
    changeOrigin: true,
    pathRewrite: (path, req) => {
      console.log('[PathRewrite] Original Path:', path); // Log original path
      const rewrittenPath = path.replace('/signup', '/user/signup');
      console.log('[PathRewrite] Rewritten Path:', rewrittenPath); // Log rewritten path
      return rewrittenPath;
    },
    onProxyReq: (proxyReq, req) => {
      console.log('[API Gateway] Forwarding request to user-service:', req.method, req.url);
  
      // Capture and log the body
      let bodyData = JSON.stringify(req.body);
      console.log('[API Gateway] Request body being forwarded:', bodyData);
  
      // Rewrite the body
      if (bodyData) {
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
      }
    },  
    onProxyRes: (proxyRes) => {
      console.log('[API Gateway] Response status from user-service:', proxyRes.statusCode);
    },
    onError: (err) => {
      console.error('[API Gateway] Error while forwarding request:', err.message);
    },
  })
);

router.use(
  '/login',
  createProxyMiddleware({
    target: 'http://user-service:3001', // Use service name
    changeOrigin: true,
    pathRewrite: { '^/login': '/user/login' }, // Rewrite `/login` to `/user/login`
    onProxyReq: (proxyReq, req) => {
      console.log('[API Gateway] Forwarding login request to user-service:', req.method, req.url);

      // Capture and log the body
      let bodyData = JSON.stringify(req.body);
      console.log('[API Gateway] Request body being forwarded:', bodyData);

      // Rewrite the body
      if (bodyData) {
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: (proxyRes) => {
      console.log('[API Gateway] Response received from user-service with status:', proxyRes.statusCode);
    },
    onError: (err, req, res) => {
      console.error('[API Gateway] Error while forwarding login request:', err.message);
      res.status(500).json({ msg: 'Gateway error' });
    },
  })
);

router.use(
  '/user/:email',
  createProxyMiddleware({
    target: 'http://user-service:3001',
    changeOrigin: true,
    pathRewrite: { '^/user': '/user' },
    onProxyReq: (proxyReq, req) => {
      console.log(`[API Gateway] Forwarding user update request to user-service: ${req.method} ${req.url}`);
      console.log(`[API Gateway] Request Body:`, req.body);
    },
    onProxyRes: (proxyRes) => {
      console.log(`[API Gateway] Response received from user-service with status: ${proxyRes.statusCode}`);
    },
    onError: (err) => {
      console.error(`[API Gateway] Error forwarding user update request: ${err.message}`);
    },
  })
);

// Proxy configuration for Newsfeed Service
router.use(
  '/newsfeed',
  createProxyMiddleware({
    target: 'http://newsfeed-service:3002',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      console.log('[API Gateway] Forwarding newsfeed request to newsfeed-service:', req.method, req.url);
    },
    onProxyRes: (proxyRes) => {
      console.log('[API Gateway] Response received from newsfeed-service with status:', proxyRes.statusCode);
    },
    onError: (err) => {
      console.error('[API Gateway] Error while forwarding newsfeed request:', err.message);
    },
  })
);

// Proxy configuration for Interest Service
router.use(
  '/interests',
  createProxyMiddleware({
    target: 'http://interest-service:3003',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      console.log('[API Gateway] Forwarding interest request to interest-service:', req.method, req.url);
    },
    onProxyRes: (proxyRes) => {
      console.log('[API Gateway] Response received from interest-service with status:', proxyRes.statusCode);
    },
    onError: (err, req, res) => {
      console.error('[API Gateway] Error while forwarding interest request:', err.message);
      res.status(500).json({ msg: 'Gateway error' });
    },
  })
);

router.use(
  '/interests/:email',
  createProxyMiddleware({
    target: 'http://interest-service:3003',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      console.log('[API Gateway] Forwarding interests update request to interest-service:', req.method, req.url);
    },
    onProxyRes: (proxyRes) => {
      console.log('[API Gateway] Response received from interest-service:', proxyRes.statusCode);
    },
    onError: (err, req, res) => {
      console.error('[API Gateway] Error forwarding interests update request:', err.message);
      res.status(500).json({ msg: 'Gateway error' });
    },
  })
);

module.exports = router;
