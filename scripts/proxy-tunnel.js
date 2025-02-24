import localtunnel from 'localtunnel';

async function startTunnel() {
  try {
    // Remove subdomain to get a random one and avoid auth
    const tunnel = await localtunnel({ 
      port: 3000,
      allow_invalid_cert: true,
      local_https: true,
      bypass_tunnel_vision: true  // Try to bypass tunnel authentication
    });
    
    console.log('🚀 Public URL:', tunnel.url);
    console.log('📝 Note: This URL will be different each time');
    
    tunnel.on('error', error => {
      console.error('❌ Tunnel error:', error);
      setTimeout(startTunnel, 1000);
    });

    tunnel.on('close', () => {
      console.log('🔄 Tunnel closed, restarting...');
      setTimeout(startTunnel, 1000);
    });

  } catch (error) {
    console.error('Failed to start tunnel:', error);
    setTimeout(startTunnel, 1000);
  }
}

startTunnel();
