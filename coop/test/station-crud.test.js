const expect  = require('chai').expect;
const request = require('supertest');
const server = require('../index')
const {username, password} = require('../config');


let station = {
    name: 'Pi Station',
    location: 'Testing grounds',
    host: '127.0.0.1',
    port: '22',
    username: 'user'
};

let token = '';

describe('CRUD operations test', function() {
    before(async function() {
        const res = await request(server).get(`/users/login?username=${username}&password=${password}`);
        token = res.body.token;
    });
    describe('/add', function() {
        it('Should create the new station in the database', function(done){
            request(server)
            .post('/add')
            .set('Authorization', `Bearer ${token}`)
            .send(station)
            .expect(200)
            .then((res) => {
                const {_id, name, location, host, port, username} = res.body;
                station._id = _id;
                console.log(station);
                expect(name).to.equal(station.name);
                expect(location).to.equal(station.location);
                expect(host).to.equal(station.host);
                expect(port).to.equal(station.port);
                expect(username).to.equal(station.username);
                done();
            })
            .catch(done)
        });
    });
    //after(function() )
    describe('/list', function() {
        it('Should list all stations', function(done){
            request(server)
            .get('/list')
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.an('array');
                if (res.length > 0 ) {
                    expect(res.body[0]).to.have.property('_id');
                    expect(res.body[0]).to.have.property('name');
                    expect(res.body[0]).to.have.property('location');
                    expect(res.body[0]).to.have.property('host');
                    expect(res.body[0]).to.have.property('port');
                    expect(res.body[0]).to.have.property('username');
                    expect(res.body[0]).to.have.property('lastBackup');
                    expect(res.body[0]).to.have.property('isOnline');
                    expect(res.body[0]).to.have.property('onlineSince');
                }
                done();
            })
            .catch(done)
        });
    });
    let update = {};
    describe('/edit', function() {
        it('Should edit details of the station', function(done){
            update = {
                _id: station._id,
                name: 'Pi New Station',
                location: 'Testing',
                host: '127.0.0.0',
                port: '23',
                username: 'newuser',
            };
            request(server)
            .post('/edit')
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(200)
            .then((res) => {
                const { name, location, host, username} = res.body;
                expect(name).to.equal(update.name);
                expect(location).to.equal(update.location);
                expect(host).to.equal(update.host);
                expect(username).to.equal(update.username);
                done();
            })
            .catch(done)
        });
    });
    describe('/delete', function() {
        it('Should delete the created station from db', function(done){
            request(server)
            .post('/delete')
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(200)
            .then((res) => {
                const {_id, name, location, host, username} = res.body;
                expect(_id).to.equal(update._id);
                expect(name).to.equal(update.name);
                expect(location).to.equal(update.location);
                expect(host).to.equal(update.host);
                expect(username).to.equal(update.username);
                done();
            })
            .catch(done)
        })
    });
});