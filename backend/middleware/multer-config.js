const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_').split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + '_' + Date.now() + '.' + extension);
  }
});

const fileFilter = (req, file, callback) => {
  if (!MIME_TYPES[file.mimetype]) {
    return callback(new Error('Format de fichier non autorisé'), false);
  }
  callback(null, true);
};

module.exports = multer({ storage, fileFilter }).single('image');