const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const verifyToken = require('../middleware/verifyToken');
const mongoose = require('mongoose');

router.post('/wishlist', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    const Book = mongoose.model('Book');
    const book = await Book.findById(bookId).lean();

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        userName: req.userName || 'Unknown',
        books: []
      });
    }

    const alreadyExists = wishlist.books.some(
      (b) => b.bookId.toString() === bookId
    );

    if (alreadyExists) {
      return res.status(400).json({ message: 'Book already in wishlist' });
    }

    wishlist.books.push({
      bookId: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      price: book.price
    });

    await wishlist.save();
    res.status(201).json({ message: 'Book added to wishlist' });

  } catch (err) {
    console.error('Error adding to wishlist:', err);
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
});

router.get('/wishlist', verifyToken, async (req, res) => {
  try {
    console.log("🔍 Loading wishlist for:", req.userId);
    const wishlist = await Wishlist.findOne({ userId: req.userId });

    res.json({ wishlist: wishlist?.books || [] });
  } catch (err) {
    console.error('Error loading wishlist:', err);
    res.status(500).json({ message: 'Failed to load wishlist' });
  }
});

router.delete('/wishlist/:bookId', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { bookId } = req.params;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const newBooks = wishlist.books.filter(
      (b) => b.bookId.toString() !== bookId
    );

    if (newBooks.length === wishlist.books.length) {
      return res.status(404).json({ message: 'Book not in wishlist' });
    }

    wishlist.books = newBooks;
    await wishlist.save();

    res.json({ message: 'Book removed from wishlist' });
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
});

module.exports = router;
