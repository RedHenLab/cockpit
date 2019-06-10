const Telemetry = require('./telemetry');
const Station = require('./stations.model');
const Report = require('./report.model');

class Control {
    /* 
     * List all the Red Hen Capture Stations whose 
     * config information is currently present in DB.
     */
    async listStations (req, res) {
        const stations = await Station.retrieve()
        res.json(stations);
    }

    /*
     * Check if Capture Station is online and refresh 
     * its status information in the DB. 
     */
    async refreshStationInfo(req, res) {
        const station = await Station.findOne({_id: req.body.stationId}).exec();
        const tele = new Telemetry(station);
        const date = await tele.statusCheck();
        station.lastChecked = new Date();
        station.onlineSince = date;
        await station.save();
        res.json(station);
    }

    /*
     * Run the preloaded diagnostic helth check script
     * on the Capture Station.
     */ 
    async runDiagnostics(req, res) {
        const station = await Station.findOne({_id: req.body._id}).exec();
        const tele = new Telemetry(station)
        const freshReport = await tele.healthCheck();
  
        const report = new Report();
        report.stationId = req.body._id;
        report.disks = freshReport.storage.disks;
        report.cards = freshReport.storage.cards;
        report.hdhomerun_devices = freshReport.hdhomerun_devices;
        report.security = freshReport.security;
        report.errors = freshReport.errors;

        await report.save()
        res.json(report);
    }

    /*
     * Add a new Capture Station to DB
     */
    addStation(req) {
        const { name, location } = req.body;
        Station.create({
            name,
            location,
            host: '192.168.1.7',
            port: '22',
            username: 'pi',
            password: 'raspberry',
            lastChecked: Date.now(),
            lastBackup: Date.now()
        }, function(err, obj) { 
            console.log(obj);
        });
    }

    /*
     * Edit an existing Capture station
     * Only name, location, host, port and username
     * can be changed.
    */
   async editStation(req,res) {
        const { _id, name, location, host, port, username } = req.body.station;
        const station = await Station.findOne({_id: _id}).exec();
        station.name = name;
        station.location = location;
        station.host = host;
        station.port = port;
        station.username = username;
        await station.save();
        res.json(station);
   }

}

module.exports = Control;