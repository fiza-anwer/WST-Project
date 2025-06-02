const express = require('express');
const router = express.Router();
const Message = require('./Message');
const User = require('./User');
const Book = require('./Book');
const verifyToken = require('./VerifyToken');

router.post('/startConversation', verifyToken, async (req, res) => {
  const { receiverId, bookId } = req.body;
  const senderId = req.userId;

  try {
    // Check if it already exists
    const exists = await Conversation.findOne({ senderId, receiverId, bookId });
    if (!exists) {
      await Conversation.create({ senderId, receiverId, bookId });
    }

    res.json({ message: 'Conversation started' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to start conversation' });
  }
});

router.post('/sendMessage', verifyToken, async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId, bookId, text } = req.body;

    if (!receiverId || !bookId || !text) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      book: bookId,
      text
    });

    await message.save();
    res.status(201).json({ message });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Message validation failed' });
  }
});

router.get('/seller/conversations', verifyToken, async (req, res) => {
  try {
    const sellerId = req.userId;
    console.log('✅ Route hit by:', sellerId);

    const messages = await Message.find({ sender: sellerId }).populate('book');

    const conversationMap = new Map();

    for (let msg of messages) {
      const key = msg.book + '-' + msg.receiver;
      if (!conversationMap.has(key)) {
        const buyer = await User.findById(msg.receiver);
        const book = await Book.findById(msg.book);
        conversationMap.set(key, {
          receiverId: msg.receiver,
          receiverName: buyer?.name || buyer?.email || 'Buyer',
          bookId: msg.book,
          bookTitle: book?.title || 'Untitled',
        });
      }
    }

    res.json({ conversations: Array.from(conversationMap.values()) });
  } catch (err) {
    console.error('❌ Error loading seller conversations:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
