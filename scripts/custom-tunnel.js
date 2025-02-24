import localtunnel from 'localtunnel';

async function startTunnel() {
  try {
    const tunnel = await localtunnel({ 
      port: 5173,
      host: 'http://localhost:3000',
      subdomain: 'asthra'
    });
    
    console.log('\n🚀 =====================================');
    console.log('Public URL:', tunnel.url);
    console.log('=====================================\n');
    
    tunnel.on('error', error => {
      console.error('❌ Tunnel error:', error);
      tunnel.close();
      setTimeout(startTunnel, 2000);
    });

    tunnel.on('close', () => {
      console.log('🔄 Tunnel closed, restarting...');
      setTimeout(startTunnel, 2000);
    });

  } catch (error) {
    console.error('Failed to start tunnel:', error);
    setTimeout(startTunnel, 2000);
  }
}

startTunnel();
