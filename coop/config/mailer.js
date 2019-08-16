const nodemailer = require('nodemailer');
const config = require('../config');

module.exports = nodemailer.createTransport({
  pool: true,
  host: config.smtp_host,
  port: 465,
  secure: true, // use TLS
  auth: {
    user: config.smtp_username,
    pass: config.smtp_password,
  },
});
