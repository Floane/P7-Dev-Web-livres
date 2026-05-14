const express = require('express');
const router = express.Router();

const bookCtrl = require('../Controllers/book');

router.get('/bestrating', bookCtrl.getBestRating);
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', bookCtrl.createBook);
router.put('/:id', bookCtrl.modifyBook);
router.delete('/:id', bookCtrl.deleteBook);

module.exports = router;