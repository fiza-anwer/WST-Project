const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
