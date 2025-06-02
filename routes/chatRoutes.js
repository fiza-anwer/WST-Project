const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Book = require('../models/Book');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).populate('sender receiver book');

    const conversations = {};

    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
      const bookId = msg.book ? msg.book._id.toString() : 'no-book';

      const key = `${otherUser._id}-${bookId}`;

      if (!conversations[key]) {
        conversations[key] = {
          receiverId: otherUser._id,
          receiverName: otherUser.name,
          bookId: msg.book?._id,
          bookTitle: msg.book?.title
        };
      }
    });

    res.json({ conversations: Object.values(conversations) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load conversations' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { receiverId, bookId, content } = req.body;

    if (!receiverId || !bookId || !content) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const newMessage = new Message({
      sender: req.userId,
      receiver: receiverId,
      book: bookId,
      content: content,
    });

    await newMessage.save();
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/:bookId/:otherUserId', verifyToken, async (req, res) => {
  try {
    const { bookId, otherUserId } = req.params;
    const userId = req.userId;
    console.log(otherUserId)
    console.log(userId);
    const messages = await Message.find({
      book: bookId,
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    }).sort({ timestamp: 1 });

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

router.get('/seller/conversations', verifyToken, async (req, res) => {
  try {
    console.log("📩 Message received via socket:", msg);
    const userId = req.userId;
    console.log("-----------------------")
    console.log(userId)

    const messages = await Message.find({ receiver: userId })
      .populate('sender', 'name')
      .populate('book', 'title');

    const conversationsMap = new Map();

    messages.forEach(msg => {
      const key = `${msg.sender._id}_${msg.book._id}`;
      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          receiverId: msg.sender._id,
          receiverName: msg.sender.name,
          bookId: msg.book._id,
          bookTitle: msg.book.title
        });
      }
    });

    res.json({ conversations: Array.from(conversationsMap.values()) });
  } catch (err) {
    console.error('Failed to get seller conversations:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


async function getUserName(userId) {
  const user = await User.findById(userId);
  return user ? user.name || user.email : 'Unknown';
}

module.exports = router;
