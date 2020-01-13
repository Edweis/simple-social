const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const argv = require('minimist')(process.argv.slice(2));

const isInDocker = argv.docker || false;
console.log({ isInDocker });
const dbUrl = isInDocker
  ? 'mongodb://mongo:27017/test'
  : 'mongodb://localhost/test';
const port = isInDocker ? 8080 : 8000;
// Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

// Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

// Initiate our app
const app = express();

// Configure our app
app.use(cors());
app.use(require('morgan')('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my_secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }),
);

if (!isProduction) app.use(errorHandler());

// Configure Mongoose
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.debug('Conected to mangoose'));
require('./models/Users');
require('./models/Posts');
require('./config/passport');
app.use(require('./routes'));

// health endpoint
const auth = require('./routes/auth');

app.get('/health', auth.optional, (req, res) => {
  res.json({ status: 'success', message: 'up', isConnected: req.user != null });
});

// Error handlers & middlewares
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: { message: err.message, error: isProduction ? {} : err },
  });
});

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}/`),
);

module.exports = app;
