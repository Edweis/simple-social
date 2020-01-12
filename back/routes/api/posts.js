const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');

const Posts = mongoose.model('Posts');

router.get('', auth.optional, async (req, res) => {
  const posts = await Posts.find();

  return res.send(posts);
});

module.exports = router;
