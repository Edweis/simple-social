const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');

const Posts = mongoose.model('Posts');

router.get('', auth.optional, async (req, res) => {
  const posts = await Posts.find();
  return res.send(posts);
});

router.post('', auth.required, async (req, res) => {
  const { body } = req;
  const { post } = body;

  if (!post.title)
    return res.status(422).json({ errors: { title: 'is required' } });
  if (!post.description)
    return res.status(422).json({ errors: { description: 'is required' } });

  const { email } = req.user;
  const finalPost = await new Posts({ ...post, authorEmail: email }).save();

  return res.send(finalPost);
});

module.exports = router;
