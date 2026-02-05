const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

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
    // Use crypto for secure random filenames
    const randomName = crypto.randomBytes(16).toString('hex');
    cb(null, randomName + ext)
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Explicitly block dangerous extensions (Double extension attack protection)
    if (file.originalname.match(/\.(php|php5|php7|phtml|asp|aspx|jsp|pl|py|sh|bat|exe|dll|vbs)$/i)) {
        return cb(new Error('Security Error: File type not allowed'));
    }

    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif|webp|mp4|webm|mov|mp3|wav|ogg/;
    
    // Check extension
    const extname = filetypes.test(ext);
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