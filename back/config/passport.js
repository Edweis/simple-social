const mongoose = require('mongoose');
const passport = require('passport');
const CustomStrategy = require('passport-custom');

const Users = mongoose.model('Users');

passport.use(
  new CustomStrategy(async (req, done) => {
    const { username, email, password } = req.body.user;
    const user = await Users.findOne({ $or: [{ email }, { username }] });
    if (!user || !user.validatePassword(password)) {
      return done(null, false, {
        errors: { 'email/username or password': 'is invalid' },
      });
    }
    return done(null, user);
  }),
);
