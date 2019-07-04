const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config');

// JWT validity period 
const validityPeriod = 10;

/**
 * Mongoose User schema
 * Inspired heavily by https://thinkster.io/tutorials/node-json-api/creating-the-user-model
 */
let UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    role: String,
    hash: String,
    salt: String,
})

/**
 * Set hashed password using the standard node crypto module
 */
UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
}

/**
 * Recompute hash during verification
 */
UserSchema.methods.verifyPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
}

/**
 * Generate signed JWT
 */
UserSchema.methods.generateJWT = function () {
    const today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + validityPeriod);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};


module.exports = mongoose.model('Station',UserSchema);


