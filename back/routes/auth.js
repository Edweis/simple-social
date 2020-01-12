const jwt = require('express-jwt');

const getTokenFromHeaders = req => {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(' ')[0] === 'Token') {
    console.debug('Has authorizartion !');
    return authorization.split(' ')[1];
  }

  return null;
};

const auth = {
  required: jwt({
    secret: 'secret',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: 'secret',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = auth;
