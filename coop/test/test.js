const expect  = require('chai').expect;
const request = require('supertest');
const server = require('../index')


let station = {
    name: 'Pi Station',
    location: 'Testing grounds',
    host: '127.0.0.1',
    port: '22',
    username: 'user'
}
describe('CRUD operations on db', function() {
    describe('/add', function() {
        it('Should create the new station in the database', function(done){
            request(server)
            .post('/add')
            .send(station)
            .expect(200)
            .then((res) => {
                const {_id, name, location, host, port, username} = res.body;
                station._id = _id;
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
    before(async function() {
        let res = await request(server).post('/add').send(station);
        station._id = res.body._id;
        update = {
            _id: station._id,
            name: 'Pi New Station',
            location: 'Testing',
            host: '127.0.0.0',
            port: '23',
            username: 'newuser',
        };
    });
    describe('/edit', function() {
        it('Should edit details of the station', function(done){
            request(server)
            .post('/edit')
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
            .send(station)
            .expect(200)
            .then((res) => {
                const {_id, name, location, host, username} = res.body;
                expect(_id).to.equal(station._id);
                expect(name).to.equal(station.name);
                expect(location).to.equal(station.location);
                expect(host).to.equal(station.host);
                expect(username).to.equal(station.username);
                done();
            })
            .catch(done)
        })
    });
});

describe('Connection operations', function() {
    before(async function() {
        let res = await request(server).post('/add').send(station);
        station._id = res.body._id;
    });
    describe('/refresh', function() {
        this.timeout(150000);
        it('Should ping and refresh uptime information of the station', function(done){
            request(server)
            .post('/refresh')
            .send({_id:station._id})
            .expect(200)
            .then((res) => {
                expect(res.body).to.have.property('_id');
                expect(res.body).to.have.property('name');
                expect(res.body).to.have.property('location');
                expect(res.body).to.have.property('host');
                expect(res.body).to.have.property('port');
                expect(res.body).to.have.property('username');
                expect(res.body).to.have.property('lastChecked');
                expect(res.body).to.have.property('isOnline');
                expect(res.body).to.have.property('onlineSince');
                done();
            })
            .catch(done)
        })
    });
    
    describe('/report', function() {
        this.timeout(150000);
        it('Should generate health report', function(done){
            request(server)
            .post('/report')
            .send({_id: station._id})
            .expect(200)
            .then((res) => {
                expect(res.body).to.have.property('stationId');
                expect(res.body).to.have.property('disks');
                expect(res.body).to.have.property('cards');
                expect(res.body).to.have.property('hdhomerun_devices');
                expect(res.body).to.have.property('security');
                expect(res.body).to.have.property('errorsLog');
                done();
            })
            .catch(done)
        })
    });
});

