const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');

const Users = mongoose.model('Users');

// POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res) => {
  const { body } = req;
  const { user } = body;

  if (!user.email)
    return res.status(422).json({ errors: { email: 'is required' } });
  if (!user.username)
    return res.status(422).json({ errors: { username: 'is required' } });
  if (!user.password)
    return res.status(422).json({ errors: { password: 'is required' } });

  const finalUser = new Users({ ...user, bio: 'the user has no bio' });

  finalUser.setPassword(user.password);
  return finalUser
    .save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
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
    'local',
    { session: false },
    (err, passportUser, info) => {
      if (err) return next(err);

      if (passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
        return res.json({ user: user.toAuthJSON() });
      }
      return status(400).info;
    },
  )(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.sendStatus(200);
});

// GET current route (required, only authenticated users have access)
router.get('/current', auth.required, async (req, res) => {
  const {
    user: { id },
  } = req;

  const user = await Users.findById(id);

  if (!user) return res.sendStatus(400);
  return res.json({ user: user.toAuthJSON() });
});

router.post('/current', auth.required, async (req, res) => {
  const {
    user: { id },
  } = req;
  const { bio } = req.body;

  const user = await Users.findById(id);

  user.set('bio', bio);
  const finalUser = await user.save();
  console.debug({ finalUser, bio });
  return res.json({ user: finalUser });
});

module.exports = router;
