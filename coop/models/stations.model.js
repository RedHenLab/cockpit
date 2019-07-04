const mongoose = require('mongoose');

/**
 * Threshold to calulate uptime expressed in  milliseconds
 * 1000 (milliseconds) * 60 (seconds) * 60 (minutes) * 12 (hours) = 12 hour threshold
 */
const uptimeThreshold = 1000 * 60 * 60 *12;  

/**
 * Mongoose schema for capture stations
 */
let StationSchema = new mongoose.Schema({
    name: String,
    location: String,
    host: String,
    port: String,
    username: String,
    password: String,
    lastChecked: Date,
    lastBackup: Date,
    onlineSince: Date,
})

StationSchema.statics = {
    /**
     * Retrieves all station objects from db and filters out fields to be passed to frontend
     */
    async retrieve() {
        return new Promise(async (resolve,reject) => {
            try {
                let stations = await this.find().lean().exec();
                stations = stations.map( (station) => {
                    const isOnline = (station.lastChecked)? (( Date.now() - station.lastChecked ) < uptimeThreshold): false;
                    const { _id, name, location, host, port, username, lastBackup, lastChecked, onlineSince} = station;
                    return { _id, name, location, host, port, username, lastBackup, lastChecked, isOnline, onlineSince};
                });
                resolve(stations);
            }
            catch (err) { reject(err); }
        });
    }
}

module.exports = mongoose.model('Station',StationSchema);


