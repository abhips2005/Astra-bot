import { exec } from 'child_process';

const startTunnel = () => {
  console.log('Starting ngrok tunnel...');
  
  const tunnel = exec('ngrok http https://localhost:5173');

  tunnel.stdout.on('data', (data) => {
    if (data.includes('url=')) {
      const match = data.match(/url=https:\/\/[^.]+\.ngrok\.io/);
      if (match) {
        const url = match[0].replace('url=', '');
        console.log('\n🚀 =====================================');
        console.log('Public URL:', url);
        console.log('=====================================\n');
      }
    }
  });

  tunnel.stderr.on('data', (data) => {
    if (!data.includes('info')) {
      console.error('Tunnel error:', data);
    }
  });

  process.on('SIGINT', () => {
    tunnel.kill();
    process.exit(0);
  });
};

startTunnel();
