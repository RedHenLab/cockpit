const { expect } = require('chai');
const request = require('supertest');
const server = require('../index');
const { username: testUser, password } = require('../config');


const station = {
  name: 'Pi Station',
  location: 'Testing grounds',
  host: '127.0.0.1',
  port: '22',
  SSHUsername: 'user',
  SSHHostPath: ['fenix'],
};

let token = '';

describe('CRUD operations test', () => {
  before(async () => {
    const res = await request(server).get(`/login?username=${testUser}&password=${password}`);
    ({ token } = res.body);
  });
  describe('/add', () => {
    it('Should create the new station in the database', (done) => {
      request(server)
        .post('/add')
        .set('Authorization', `Bearer ${token}`)
        .send(station)
        .expect(200)
        .then((res) => {
          const { _id, name, location, host, port, SSHUsername } = res.body;
          station._id = _id;
          expect(name).to.equal(station.name);
          expect(location).to.equal(station.location);
          expect(host).to.equal(station.host);
          expect(port).to.equal(station.port);
          expect(SSHUsername).to.equal(station.SSHUsername);
          done();
        })
        .catch(done);
    });
  });
  // after(function() )
  describe('/list', () => {
    it('Should list all stations', (done) => {
      request(server)
        .get('/list')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          if (res.length > 0) {
            expect(res.body[0]).to.have.property('_id');
            expect(res.body[0]).to.have.property('name');
            expect(res.body[0]).to.have.property('location');
            expect(res.body[0]).to.have.property('host');
            expect(res.body[0]).to.have.property('port');
            expect(res.body[0]).to.have.property('SSHUsername');
            expect(res.body[0]).to.have.property('lastBackup');
            expect(res.body[0]).to.have.property('isOnline');
            expect(res.body[0]).to.have.property('onlineSince');
          }
          done();
        })
        .catch(done);
    });
  });
  let update = {};
  describe('/edit', () => {
    it('Should edit details of the station', (done) => {
      update = {
        _id: station._id,
        name: 'Pi New Station',
        location: 'Testing',
        host: '127.0.0.0',
        port: '23',
        SSHUsername: 'newuser',
      };
      request(server)
        .post('/edit')
        .set('Authorization', `Bearer ${token}`)
        .send(update)
        .expect(200)
        .then((res) => {
          const { name, location, host, SSHUsername } = res.body;
          expect(name).to.equal(update.name);
          expect(location).to.equal(update.location);
          expect(host).to.equal(update.host);
          expect(SSHUsername).to.equal(update.SSHUsername);
          done();
        })
        .catch(done);
    });
  });
  describe('/delete', () => {
    it('Should delete the created station from db', (done) => {
      request(server)
        .post('/delete')
        .set('Authorization', `Bearer ${token}`)
        .send(update)
        .expect(200)
        .then((res) => {
          const { _id, name, location, host, SSHUsername } = res.body;
          expect(_id).to.equal(update._id);
          expect(name).to.equal(update.name);
          expect(location).to.equal(update.location);
          expect(host).to.equal(update.host);
          expect(SSHUsername).to.equal(update.SSHUsername);
          done();
        })
        .catch(done);
    });
  });
});
