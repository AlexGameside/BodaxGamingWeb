import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';

const distDir = 'dist';
const configFiles = [
  { src: 'public/.htaccess', dest: 'dist/.htaccess' },
  { src: 'public/web.config', dest: 'dist/web.config' },
  { src: 'public/_redirects', dest: 'dist/_redirects' }
];

console.log('Copying server configuration files...');

configFiles.forEach(({ src, dest }) => {
  if (existsSync(src)) {
    copyFileSync(src, dest);
    console.log(`✓ Copied ${src} to ${dest}`);
  } else {
    console.log(`⚠ File not found: ${src}`);
  }
});

console.log('Server configuration files copied successfully!');
