const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const { checkIsEmail } = require('./helpers');

const Users = mongoose.model('Users');

// POST new user route (optional, everyone has access)
router.post('/', auth.optional, async (req, res) => {
  const { body } = req;
  const { user } = body;

  if (!user) return res.status(422).json({ errors: { user: 'is required' } });
  if (!user.email || !checkIsEmail(user.email)) {
    return res
      .status(422)
      .json({ errors: { email: 'is required as an email' } });
  }
  if (!user.username)
    return res.status(422).json({ errors: { username: 'is required' } });
  if (!user.password)
    return res.status(422).json({ errors: { password: 'is required' } });

  const finalUser = new Users({ ...user, bio: 'the user has no bio' });

  finalUser.setPassword(user.password);
  await finalUser.save();
  return res.json({ user: finalUser.toAuthJSON() });
});

// POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { body } = req;
  const { user } = body;

  if (!user.email && !user.username) {
    return res
      .status(422)
      .json({ errors: { email: 'is required (or username)' } });
  }

  if (!user.password)
    return res.status(422).json({ errors: { password: 'is required' } });

  return passport.authenticate(
    'custom',
    { session: false },
    (err, passportUser) => {
      if (err) return next(err);

      if (passportUser) {
        const token = passportUser.generateJWT();
        return res.json({ user: { ...passportUser.toAuthJSON(), token } });
      }
      return status(400).info;
    },
  )(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.sendStatus(200);
});

router.get('/current', auth.required, async (req, res) => {
  const {
    user: { id },
  } = req;
  const user = await Users.findById(id);
  return res.json({ user: user.toAuthJSON() });
});

router.delete('/current', auth.required, async (req, res) => {
  const {
    user: { id },
  } = req;
  const user = await Users.findById(id);

  const { subscription } = req.body;
  if (subscription && user.subscriptions.includes(subscription)) {
    user.set(
      'subscriptions',
      user.subscriptions.filter(s => s !== subscription),
    );
  }

  const finalUser = await user.save();
  return res.json({ user: finalUser });
});

router.post('/current', auth.required, async (req, res) => {
  const {
    user: { id },
  } = req;
  const { bio, subscription } = req.body;
  const user = await Users.findById(id);

  if (bio) user.set('bio', bio);
  if (subscription) {
    const subscribedUser = await Users.find({ username: subscription });
    if (subscribedUser.length !== 0)
      user.set('subscriptions', [...user.subscriptions, subscription]);
    else {
      return res
        .status(400)
        .json({ errors: { subscription: 'username not found.' } });
    }
  }
  const finalUser = await user.save();
  return res.json({ user: finalUser });
});

module.exports = router;
