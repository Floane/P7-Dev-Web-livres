const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multerUpload = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-config');
const bookCtrl = require('../controllers/book');

const multerMiddleware = (req, res, next) => {
  multerUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

router.get('/bestrating', bookCtrl.getBestRating);
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, multerMiddleware, sharp, bookCtrl.createBook);
router.put('/:id', auth, multerMiddleware, sharp, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;