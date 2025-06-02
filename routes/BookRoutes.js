const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const verifyToken = require('../middleware/verifyToken');
const { io } = require('../server');

router.post('/add', verifyToken, async (req, res) => {
  try {
    console.log('📘 Book route mounted');
    const { title, author, price, genre, imageUrl, ownerName, phone, address, description } = req.body;

    const newBook = new Book({
      title,
      author,
      price,
      genre,
      imageUrl,
      ownerName,
      phone,
      address,
      description,
      ownerId: req.userId,
      seller: req.userId
    });

    const savedBook = await newBook.save();

    req.app.get('io').emit('newBookAdded', savedBook);

    res.status(201).json({ message: 'Book added successfully' });
  } catch (err) {
    console.error('Book Add Error:', err.message);
    res.status(500).json({ message: 'Failed to add book' });
  }
});


router.get('/viewBooks', verifyToken, async (req, res) => {
  try {
    const books = await Book.find({ seller: req.userId });
    res.json({ books });
  } catch (err) {
    console.error('Error viewing books:', err);
    res.status(500).json({ message: 'Failed to retrieve books' });
  }
});

router.get('/viewAvailableBooks', verifyToken, async (req, res) => {
  try {
    const books = await Book.find({ status: 'available' });
    res.json({ books });
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

router.put('/updateStatus/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.status = req.body.status || book.status;
    await book.save();

    res.json({ message: 'Book status updated', book });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ message: 'Failed to update book status' });
  }
});

router.put('/sellBook/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, seller: req.userId });
    if (!book) return res.status(403).json({ message: 'You can only mark your own books as sold' });

    book.status = 'sold';
    await book.save();

    res.json({ message: 'Book marked as sold' });
  } catch (err) {
    console.error('Error marking book as sold:', err);
    res.status(500).json({ message: 'Failed to mark book as sold' });
  }
});

router.put('/purchase/:id', verifyToken, async (req, res) => {
  try {
    console.log('🔐 Book seller:', book.seller);
    console.log('🧑‍💼 Buyer (req.userId):', req.userId);
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.status === 'sold') {
      return res.status(400).json({ message: 'Book already sold' });
    }

    if (book.seller.toString() === req.userId) {
      return res.status(403).json({ message: 'You cannot buy your own book' });
    }

    book.status = 'sold';
    await book.save();

    res.json({ message: 'Book purchased successfully' });
  } catch (err) {
    console.error('Purchase error:', err);
    res.status(500).json({ message: 'Failed to purchase book' });
  }
});

router.delete('/deleteBook/:id', verifyToken, async (req, res) => {
  try {
    const result = await Book.deleteOne({ _id: req.params.id, seller: req.userId });
    if (result.deletedCount === 0) return res.status(403).json({ message: 'Unauthorized delete attempt' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ message: 'Failed to delete book' });
  }
});

router.put('/updateBook/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, seller: req.userId },
      req.body,
      { new: true }
    );
    if (!book) return res.status(403).json({ message: 'Unauthorized update attempt' });
    res.json({ message: 'Book updated successfully', book });
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({ message: 'Failed to update book' });
  }
});

router.get('/publicBooks', async (req, res) => {
  try {
    const books = await Book.find({ status: 'available' }).select('title author genre');
    res.json({ books });
  } catch (err) {
    console.error('Error fetching public books:', err);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

module.exports = router;