import localtunnel from 'localtunnel';

async function startTunnel() {
  try {
    const tunnel = await localtunnel({ 
      port: 5173,
      subdomain: 'asthra-bot',
      allow_invalid_cert: true,
      local_https: true,
      local_cert: true,
      local_key: true
    });
    
    console.log('🚀 Public URL:', tunnel.url);
    console.log('💡 Share this URL to access your local server from anywhere');
    
    tunnel.on('close', () => {
      console.log('Tunnel closed');
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
    });

  } catch (err) {
    console.error('Error setting up tunnel:', err);
  }
}

startTunnel();
