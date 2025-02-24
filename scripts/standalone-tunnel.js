import { exec } from 'child_process';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const toolsPath = resolve(__dirname, '../tools');

const startTunnel = () => {
  console.log('Starting standalone ngrok tunnel...');
  
  // Use the full path to ngrok executable
  const ngrokPath = join(toolsPath, 'ngrok.exe');
  const tunnel = exec(`"${ngrokPath}" http https://localhost:5173 --log=stdout`);

  tunnel.stdout.on('data', (data) => {
    // Look for the forwarding URL
    if (data.includes('url=')) {
      console.log('\n🚀 =====================================');
      console.log('Tunnel output:', data.trim());
      console.log('=====================================\n');
    }
  });

  tunnel.stderr.on('data', (data) => {
    if (!data.includes('info')) {
      console.error('Tunnel error:', data);
    }
  });

  tunnel.on('close', (code) => {
    if (code !== 0) {
      console.log('Tunnel closed with code:', code);
    }
  });

  // Handle cleanup
  const cleanup = () => {
    console.log('Shutting down tunnel...');
    tunnel.kill();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
};

startTunnel();
