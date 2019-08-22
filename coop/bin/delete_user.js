/**
 * Test input first, before making DB connection
 */
if (process.argv.length !== 3) {
  console.log('Usage: node bin/delete_user.js <username>');
  process.exit(1);
}

const [path, username] = process.argv.slice(1);

if (path !== 'bin/delete_user.js') {
  console.log('Run this script from the root directory of coop');
  console.log('Usage: node bin/delete_user.js <username>');
  process.exit(1);
}

const mongoose = require('mongoose');
const User = require('../models/user.model');

const config = require('../config');

mongoose.connect(config.mongo, { useNewUrlParser: true })
  .catch((err) => {
    console.log('Could not connect to MongoDB.');
    console.log(err);
    process.exit(1);
  });

User.findOneAndDelete({ username })
  .then((user) => {
    if (user) console.log('Success! Deleted user.');
    else console.log('User not found.');
  })
  .catch((err) => {
    console.log('Could not delete user');
    console.log(err.message);
  })
  .finally(() => process.exit(0));
