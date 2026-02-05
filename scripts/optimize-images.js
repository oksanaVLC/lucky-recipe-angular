const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFolder = path.join(__dirname, '../src/assets/images');
const outputFolder = path.join(__dirname, '../src/assets/images-optimized');

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

fs.readdirSync(inputFolder).forEach(async (file) => {
  const inputPath = path.join(inputFolder, file);
  const ext = path.extname(file).toLowerCase();

  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const fileName = path.basename(file, ext);
  const outputPath = path.join(outputFolder, `${fileName}.webp`);

  try {
    await sharp(inputPath)
      .resize(800, 800, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(outputPath);

    console.log(`✅ ${file} → ${fileName}.webp`);
  } catch (err) {
    console.error(`❌ Error con ${file}:`, err);
  }
});
