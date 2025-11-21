const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createThumbnail(imagePath) {
  try {
    const ext = path.extname(imagePath);
    const thumbnailPath = imagePath.replace(ext, '-thumb' + ext);
    
    await sharp(imagePath)
      .resize(200, 200, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(thumbnailPath);
    
    return thumbnailPath;
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    return null;
  }
}

async function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

module.exports = { createThumbnail, deleteFile };
