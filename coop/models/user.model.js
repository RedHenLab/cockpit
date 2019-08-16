const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

// JWT validity period
const validityPeriod = 10;

/**
 * Mongoose User schema
 * Inspired heavily by https://thinkster.io/tutorials/node-json-api/creating-the-user-model
 */
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  role: String,
  hash: String,
  salt: String, // TODO : last login timestamp
});

/**
 * Set hashed password using the standard node crypto module
 */
UserSchema.methods.setPassword = function setPassword(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
};

/**
 * Recompute hash during verification
 */
UserSchema.methods.validPassword = function validPassword(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

/**
 * Generate signed JWT
 */
UserSchema.methods.generateJWT = function generateJWT() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + validityPeriod);

  return jwt.sign({
    id: this._id,
    username: this.username,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

/**
 * Generate User json object to be passed in response
 */
UserSchema.methods.toAuthJSON = function toAUTHJSON() {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    role: this.role,
  };
};

module.exports = mongoose.model('User', UserSchema);
