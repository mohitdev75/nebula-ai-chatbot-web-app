const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'model', 'assistant']
  },
  content: {
    type: String,
    required: true
  }
}, { _id: false });

const chatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', chatSchema);
