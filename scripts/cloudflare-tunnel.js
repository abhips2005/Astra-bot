import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const findCloudflared = () => {
  // Common paths where cloudflared might be installed
  const possiblePaths = [
    'C:\\Program Files\\cloudflared\\cloudflared.exe',
    'C:\\Program Files (x86)\\cloudflared\\cloudflared.exe',
    join(process.env.USERPROFILE || '', '.cloudflared\\cloudflared.exe'),
    'cloudflared',  // If it's in PATH
  ];

  for (const path of possiblePaths) {
    try {
      if (path === 'cloudflared' || fs.existsSync(path)) {
        return path;
      }
    } catch (e) {
      continue;
    }
  }
  return null;
};

const startTunnel = () => {
  console.log('Looking for cloudflared...');
  
  const cloudflaredPath = findCloudflared();
  if (!cloudflaredPath) {
    console.error('\n❌ cloudflared not found! Please install it first:');
    console.log('1. Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/');
    console.log('2. Or using Windows Package Manager: winget install cloudflare.cloudflared');
    console.log('3. Or using Chocolatey: choco install cloudflared\n');
    process.exit(1);
  }

  console.log('Starting Cloudflare tunnel...');
  
  const tunnel = exec(`"${cloudflaredPath}" tunnel --url https://localhost:5173`);
  let isFirstConnection = true;

  tunnel.stdout.on('data', (data) => {
    // Look for the tunnel URL in the output
    if (data.includes('trycloudflare.com')) {
      const urlMatch = data.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
      if (urlMatch && isFirstConnection) {
        isFirstConnection = false;
        console.log('\n🚀 =====================================');
        console.log('Public URL:', urlMatch[0]);
        console.log('=====================================\n');
      }
    }
  });

  tunnel.stderr.on('data', (data) => {
    // Only log real errors, ignore info messages
    if (data.includes('ERR') && !data.includes('context canceled')) {
      console.error('Tunnel error:', data.trim());
      
      // Restart tunnel on connection errors
      if (data.includes('Failed to serve tunnel connection')) {
        console.log('Restarting tunnel...');
        tunnel.kill();
        setTimeout(startTunnel, 2000);
      }
    }
  });

  tunnel.on('close', (code) => {
    console.log('Tunnel closed with code:', code);
    if (code !== 0) {
      console.log('Restarting tunnel in 2 seconds...');
      setTimeout(startTunnel, 2000);
    }
  });

  tunnel.on('error', (error) => {
    console.error('Tunnel process error:', error);
    setTimeout(startTunnel, 2000);
  });

  // Handle graceful shutdown
  const cleanup = () => {
    console.log('Shutting down tunnel...');
    tunnel.kill();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
};

// Start with initial delay to ensure Vite is ready
setTimeout(startTunnel, 1000);
