import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CERT_DIR = join(__dirname, '..', '.certificates');

function runCommand(command) {
    try {
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`Failed to run command: ${command}`);
        console.error(error.message);
        return false;
    }
}

function setupHttps() {
    // Create certificates directory if it doesn't exist
    if (!fs.existsSync(CERT_DIR)) {
        fs.mkdirSync(CERT_DIR, { recursive: true });
    }
    console.log('📁 Created certificates directory');

    // Install local CA
    console.log('🔑 Installing local CA...');
    if (!runCommand('mkcert -install')) {
        process.exit(1);
    }

    // Generate certificates
    console.log('🔑 Generating certificates...');
    process.chdir(CERT_DIR);
    if (!runCommand('mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1')) {
        console.error('❌ Failed to generate certificates');
        process.exit(1);
    }

    console.log('✅ Certificates generated successfully!');
    console.log(`📁 Certificates location: ${CERT_DIR}`);
}

setupHttps();
