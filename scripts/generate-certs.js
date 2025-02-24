import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CERT_DIR = path.join(__dirname, '..', '.certificates');

// Check if OpenSSL is installed
try {
  execSync('openssl version');
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', 'OpenSSL is not installed!');
  console.log('\nPlease install OpenSSL first:');
  console.log('\n1. Using Chocolatey (recommended):');
  console.log('   choco install openssl');
  console.log('\n2. Or download from:');
  console.log('   https://slproweb.com/products/Win32OpenSSL.html');
  console.log('\nAfter installing, restart your terminal and try again.');
  process.exit(1);
}

// Create certificates directory if it doesn't exist
if (!fs.existsSync(CERT_DIR)) {
  fs.mkdirSync(CERT_DIR);
}

try {
  console.log('Generating self-signed certificates...');
  
  // Generate private key with specific location
  execSync(`openssl genrsa -out "${CERT_DIR}/localhost-key.pem" 2048`);
  
  // Generate certificate with specific location
  execSync(`openssl req -new -x509 -key "${CERT_DIR}/localhost-key.pem" -out "${CERT_DIR}/localhost.pem" -days 365 -subj "/CN=localhost"`);

  console.log('\x1b[32m%s\x1b[0m', 'Certificates generated successfully in .certificates folder!');
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', 'Error generating certificates:', error.message);
  process.exit(1);
}
