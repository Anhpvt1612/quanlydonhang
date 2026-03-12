// Convert SVG icons to PNG using sharp
// Install sharp first: npm install sharp

const fs = require('fs');
const path = require('path');

async function convertIcons() {
  try {
    const sharp = require('sharp');
    const iconDir = path.join(__dirname, '../fronend');
    
    // Convert 192x192
    await sharp(path.join(iconDir, 'icon-192.svg'))
      .png()
      .toFile(path.join(iconDir, 'icon-192.png'));
    
    console.log('✅ Created icon-192.png');
    
    // Convert 512x512
    await sharp(path.join(iconDir, 'icon-512.svg'))
      .png()
      .toFile(path.join(iconDir, 'icon-512.png'));
    
    console.log('✅ Created icon-512.png');
    console.log('\n🎉 All PNG icons created successfully!');
    console.log('Your PWA is now ready to install on iOS and Android!');
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('❌ Sharp is not installed.');
      console.log('\nPlease run: npm install sharp');
      console.log('\nOr use alternative method:');
      console.log('1. Open http://localhost:3000/icon-generator.html');
      console.log('2. Click buttons to download PNG icons');
      console.log('3. Save them to the fronend folder');
    } else {
      console.error('Error converting icons:', error);
    }
  }
}

convertIcons();
