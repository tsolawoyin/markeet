const fs = require('fs');
const path = require('path');

const swPath = path.join(__dirname, '../public/sw.js');
let swContent = fs.readFileSync(swPath, 'utf8');

const timestamp = Date.now();
swContent = swContent.replace(
  /const CACHE_VERSION = ['"]v[\d.]+['"]/,
  `const CACHE_VERSION = 'v${timestamp}'`
);

fs.writeFileSync(swPath, swContent);
console.log(`✅ Service worker version updated to v${timestamp}`);