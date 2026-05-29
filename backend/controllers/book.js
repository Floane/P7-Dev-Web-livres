const mongoose = require('mongoose');
const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: 'Livre non trouvé' });
  }
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ error: 'Livre non trouvé' });
      }
      res.status(200).json(book);
    })
    .catch(error => res.status(404).json({ error }));
};

exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.createBook = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image requise' });
  }

  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const bookId = new mongoose.Types.ObjectId();
  const extension = req.file.filename.split('.').pop();
  const newFilename = `${bookId}.${extension}`;
  const newPath = `images/${newFilename}`;

  fs.rename(req.file.path, newPath, (err) => {
    if (err) return res.status(500).json({ error: err });

    const book = new Book({
      ...bookObject,
      _id: bookId,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${newFilename}`
    });

    book.save()
      .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
      .catch(error => res.status(400).json({ error }));
  });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: 'Non autorisé' });
      }
      if (req.file) {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {});
      }
      Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre modifié' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: 'Livre non trouvé' });
  }
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ error: 'Livre non trouvé' });
      }
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: 'Non autorisé' });
      }
      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {});
      Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre supprimé' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));
};

exports.rateBook = (req, res, next) => {
  const rating = req.body.rating;

  if (typeof rating !== 'number') {
    return res.status(400).json({ error: 'La note doit être un nombre' });
  }

  if (rating < 0 || rating > 5) {
    return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5' });
  }

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ error: 'Livre non trouvé' });
      }

      const alreadyRated = book.ratings.find(r => r.userId === req.auth.userId);
      if (alreadyRated) {
        return res.status(403).json({ error: 'Vous avez déjà noté ce livre' });
      }

      book.ratings.push({
        userId: req.auth.userId,
        grade: rating
      });

      const averageRating = book.ratings.reduce((sum, r) => sum + r.grade, 0) / book.ratings.length;
      book.averageRating = Math.round(averageRating * 10) / 10;

      book.save()
        .then(updatedBook => res.status(201).json(updatedBook))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));
};