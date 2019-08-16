const jwt = require('express-jwt');
const { secret } = require('../config');

function getTokenFromHeader(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

const auth = jwt({
  secret,
  getToken: getTokenFromHeader,
});

module.exports = auth;
