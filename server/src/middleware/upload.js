const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext)
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit (Reduced from 1GB for safety)
  },
  fileFilter: (req, file, cb) => {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif|webp|mp4|webm|mov|mp3|wav|ogg/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = file.mimetype.startsWith('image/') || 
                     file.mimetype.startsWith('video/') || 
                     file.mimetype.startsWith('audio/');

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, videos, and audio files are allowed.'));
    }
  }
});

module.exports = upload;