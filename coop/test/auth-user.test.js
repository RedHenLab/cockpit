const { expect } = require('chai');
const request = require('supertest');
const server = require('../index');
const { username, password } = require('../config');

describe('User authentication test', () => {
  describe('/users/login', () => {
    it('Should login valid user and send JWT response', (done) => {
      request(server)
        .get(`/users/login?username=${username}&password=${password}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('role');

          expect(res.body.username).to.equal(username);

          expect(res.body.role, 'Test user needs to have admin role.').to.equal('admin');
          done();
        })
        .catch(done);
    });
  });
});
