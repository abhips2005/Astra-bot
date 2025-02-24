import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// SSL Certificate configuration
const certPath = path.resolve(__dirname, '../certificates');
const sslOptions = {
  key: fs.readFileSync(path.join(certPath, 'key.pem')),
  cert: fs.readFileSync(path.join(certPath, 'cert.pem'))
};

// Configure proxy middleware
const proxy = createProxyMiddleware({
  target: 'https://localhost:5173',
  changeOrigin: true,
  secure: false,
  ws: true,
  logLevel: 'debug'
});

// Use proxy for all requests
app.use('/', proxy);

// Create HTTPS server
const httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(PORT, () => {
  console.log(`HTTPS Proxy server running on port ${PORT}`);
});
