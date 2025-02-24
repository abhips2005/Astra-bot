import localtunnel from 'localtunnel';

async function startTunnel() {
  try {
    const tunnel = await localtunnel({
      port: 5173,
      subdomain: 'asthra-dev'
    });

    console.log('🚀 Public URL:', tunnel.url);

    tunnel.on('error', error => {
      console.error('❌ Tunnel error:', error);
    });

    tunnel.on('close', () => {
      console.log('🔒 Tunnel closed');
    });

  } catch (error) {
    console.error('Failed to start tunnel:', error);
  }
}

startTunnel();
