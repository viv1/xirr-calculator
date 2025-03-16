import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the index.html file
const indexPath = path.resolve(__dirname, 'dist', 'index.html');

// Read the file
let html = fs.readFileSync(indexPath, 'utf8');

// Replace all occurrences of /xirr-calculator/ with /
html = html.replace(/\/xirr-calculator\//g, '/');

// Write the file back
fs.writeFileSync(indexPath, html);

console.log('Asset paths fixed in index.html'); 