const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:1000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors());
app.use(express.json());
app.set('io', io);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/book-exchange', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const bookRoutes = require('./routes/BookRoutes');
const wishlistRoutes = require('./routes/wishListRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require("./routes/contactRoutes");

app.use('/', bookRoutes);
app.use('/', wishlistRoutes);
app.use('/api/messages', chatRoutes);
app.use('/', userRoutes);
app.use("/api/contact", contactRoutes);

const Message = require('./models/Message');

io.on('connection', (socket) => {
  console.log(' ✅ Socket connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('sendMessage', (message) => {
    const { receiverId } = message;
    io.to(receiverId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
module.exports = { io };
