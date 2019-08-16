const { expect } = require('chai');
require('dotenv').config();

expect(process.env).to.have.property('PORT');
expect(process.env).to.have.property('JWTSECRET');
expect(process.env).to.have.property('ENVIRONMENT');
expect(process.env).to.have.property('MONGOURI');

const config = {
  port: process.env.PORT,
  secret: process.env.JWTSECRET,
  environment: process.env.ENVIRONMENT,
  mongo: process.env.MONGOURI,
  username: undefined,
  password: undefined,
  smtp_host: undefined,
  smtp_username: undefined,
  smtp_password: undefined,
};

if (process.env.ENVIRONMENT === 'dev') {
  expect(process.env).to.have.property('USERNAME');
  config.username = process.env.USERNAME;

  expect(process.env).to.have.property('PASSWORD');
  config.password = process.env.PASSWORD;
}

if (process.env.MAIL && process.env.MAIL === 'enabled') {
  expect(process.env).to.have.property('SMTPHOST');
  config.smtp_host = process.env.SMTPHOST;

  expect(process.env).to.have.property('SMTPUSER');
  config.smtp_username = process.env.SMTPUSER;

  expect(process.env).to.have.property('SMTPPASS');
  config.smtp_password = process.env.SMTPPASS;
}

module.exports = config;
