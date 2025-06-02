const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

messageSchema.index({ sender: 1, receiver: 1, timestamp: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
