/**
 * Test input first, before making DB connection
 */

if (process.argv.length !== 6) {
  console.log('Usage: node bin/create_user.js <username> <email> <role> <password>');
  process.exit(1);
}

const [path, username, email, role, password] = process.argv.slice(1);

if (path.split('/').slice(-2).join('/') !== 'bin/create_user.js') {
  console.log(process.argv);
  console.log('Run this script from the root directory of coop');
  console.log('Usage: node bin/create_user.js <username> <email> <role> <password>');
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

User.findOne({ username })
  .then(async (usr) => {
    if (usr) console.log('This username already exists!');
    else {
      const user = new User();
      user.username = username;
      user.email = email;
      user.role = role;
      user.setPassword(password);
      await user.save();
      console.log('Success!');
    }
  })
  .catch((err) => {
    console.log('Could not create user');
    console.log(err.message);
  })
  .finally(() => process.exit(0));
