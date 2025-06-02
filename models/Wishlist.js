const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  books: [{
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    title: String,
    author: String,
    genre: String,
    price: Number,
    dateAdded: { type: Date, default: Date.now }
  }]
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;
