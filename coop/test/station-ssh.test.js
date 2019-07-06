const expect  = require('chai').expect;
const request = require('supertest');
const server = require('../index')
const {username, password} = require('../config');

let token = '';
let station;

describe('Connection tests', function() {
    before(async function() {
        let res = await request(server).get(`/users/login?username=${username}&password=${password}`);
        token = res.body.token;

        res = await request(server).get('/list');
        expect(res.body,'Need atleast one valid station in DB to run connection test.').to.have.length.greaterThan(0);
        station = res.body[0];
    });
    describe('/refresh', function() {
        this.timeout(150000);
        it('Should ping and refresh uptime information of the station', function(done){
            request(server)
            .post('/refresh')
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
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

