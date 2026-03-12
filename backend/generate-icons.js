const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const createSVG = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}"/>
  
  <!-- Box body -->
  <rect x="${size * 0.2}" y="${size * 0.35}" width="${size * 0.6}" height="${size * 0.45}" fill="white" rx="${size * 0.02}"/>
  
  <!-- Box top flap left -->
  <polygon points="${size * 0.2},${size * 0.35} ${size * 0.5},${size * 0.2} ${size * 0.5},${size * 0.35}" fill="rgba(255,255,255,0.95)"/>
  
  <!-- Box top flap right -->
  <polygon points="${size * 0.5},${size * 0.2} ${size * 0.8},${size * 0.35} ${size * 0.5},${size * 0.35}" fill="rgba(255,255,255,0.85)"/>
  
  <!-- Tape -->
  <rect x="${size * 0.45}" y="${size * 0.35}" width="${size * 0.1}" height="${size * 0.45}" fill="#764ba2" opacity="0.8"/>
  
  <!-- Check mark -->
  <path d="M ${size * 0.32} ${size * 0.55} L ${size * 0.43} ${size * 0.67} L ${size * 0.68} ${size * 0.45}" 
        stroke="#10b981" stroke-width="${size * 0.05}" stroke-linecap="round" 
        stroke-linejoin="round" fill="none"/>
</svg>`;
};

// Save SVG files
const iconDir = path.join(__dirname, '../fronend');

// Create 192x192 icon
fs.writeFileSync(
  path.join(iconDir, 'icon-192.svg'),
  createSVG(192),
  'utf8'
);

// Create 512x512 icon
fs.writeFileSync(
  path.join(iconDir, 'icon-512.svg'),
  createSVG(512),
  'utf8'
);

console.log('✅ SVG icons created successfully!');
console.log('\nNote: For best iOS support, you should convert these SVG to PNG.');
console.log('You can:');
console.log('1. Open icon-generator.html in browser and download PNG icons');
console.log('2. Or use an online converter like: https://svgtopng.com/');
console.log('3. Or install sharp: npm install sharp, then use convert-icons-to-png.js');
