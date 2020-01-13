const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');

const Posts = mongoose.model('Posts');
const Users = mongoose.model('Users');

router.get('', auth.required, async (req, res) => {
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

  console.debug(req.user);
  const { username } = req.user;
  const finalPost = await new Posts({
    ...post,
    authorUsername: username,
  }).save();

  console.debug({
    ...post,
    authorUsername: username,
  });
  return res.send(finalPost);
});

router.get('/timeline', auth.required, async (req, res) => {
  const { user } = req;
  const { subscriptions } = await Users.findById(user.id);
  const subscribedUser = [...subscriptions, user.username];
  const posts = await Posts.find({ authorUsername: { $in: subscribedUser } });
  return res.send({ posts });
});

module.exports = router;
