import ngrok from 'ngrok';

async function startTunnel() {
  try {
    console.log('Starting secure tunnel...');
    
    const url = await ngrok.connect({
      addr: 5173,
      authtoken: '2okiPN8INKf0edOWxWFLJmsYwEC_2Die6ys8CVsHRMdTvypWr',
      proto: 'http',
      region: 'in',
      onStatusChange: status => {
        console.log('Tunnel status:', status);
      }
    });

    console.log('\n🚀 =====================================');
    console.log('Public URL:', url);
    console.log('=====================================\n');

  } catch (err) {
    console.error('Error setting up tunnel:', err);
    process.exit(1);
  }

  // Handle cleanup
  process.on('SIGINT', async () => {
    await ngrok.kill();
    process.exit(0);
  });
}

startTunnel();
