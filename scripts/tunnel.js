import ngrok from 'ngrok';

async function startTunnel() {
  try {
    const url = await ngrok.connect({
      addr: 5173,
      authtoken: '2okiPN8INKf0edOWxWFLJmsYwEC_2Die6ys8CVsHRMdTvypWr',
      proto: 'http'
    });
    console.log('🚀 Public URL:', url);
  } catch (err) {
    console.error('Error setting up ngrok:', err);
  }
}

startTunnel();
