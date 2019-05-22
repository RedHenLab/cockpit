const Telemetry = require('./telemetry');
const Station = require('./stations.model');

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
        station.lastOnline = new Date();
        station.uptime = date;
        await station.save();
        res.json(station);
    }

    /*
     * Run the preloaded diagnostic helth check script
     * on the Capture Station.
     */ 
    runDiagnostics(res, req) {}

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
            console.log('Success');
            console.log(obj);
        });
    }
}

module.exports = Control;