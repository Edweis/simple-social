const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  description: String,
  authorEmail: String,
});

mongoose.model('Posts', PostSchema);
