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

// Replace all occurrences of /xirr-calculator/ with / in asset paths only
// This regex targets only the asset paths, not other URLs like Google Analytics
html = html.replace(/(src|href)="\/xirr-calculator\//g, '$1="/');

// Write the file back
fs.writeFileSync(indexPath, html);

console.log('Asset paths fixed in index.html'); 