const mongoose = require('mongoose');
const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  comments: [{ text: String, createdAt: { type: Date, default: Date.now } }]
});
module.exports = mongoose.model('Blog', BlogSchema);