import localtunnelServer from 'localtunnel/server';
import { createServer } from 'https';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const certPath = join(__dirname, '../certificates');

const server = createServer({
  key: readFileSync(join(certPath, 'key.pem')),
  cert: readFileSync(join(certPath, 'cert.pem'))
});

const tunnelServer = localtunnelServer({
  port: 5173,
  secure: true,
  domain: 'asthra-bot'
});

tunnelServer.listen(3000, () => {
  console.log('Tunnel server running on port 3000');
});
