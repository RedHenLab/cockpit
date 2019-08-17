const mongoose = require('mongoose');

/**
 * Threshold to calulate uptime expressed in  milliseconds
 * 1000 (milliseconds) * 60 (seconds) * 60 (minutes) * 12 (hours) = 12 hour threshold
 */
const uptimeThreshold = 1000 * 60 * 60 * 12;

/**
 * Mongoose schema for capture stations
 */
const StationSchema = new mongoose.Schema({
  name: String,
  location: String,
  host: String,
  port: String,
  SSHUsername: String,
  SSHHostPath: [String],
  inchargeName: String,
  inchargeEmail: String,
  lastChecked: Date,
  lastBackup: Date,
  onlineSince: Date,
});

StationSchema.statics = {
  /**
     * Retrieves all station objects from db and filters out fields to be passed to frontend
     */
  async retrieve() {
    return new Promise(async (resolve, reject) => {
      try {
        let stations = await this.find().lean().exec();
        stations = stations.map((station) => {
          const stationObj = {};
          Object.assign(stationObj, station);
          stationObj.isOnline = (station.lastChecked) ? ((Date.now() - station.lastChecked) < uptimeThreshold) : false;
          return stationObj;
        });
        resolve(stations);
      }
      catch (err) { reject(err); }
    });
  },
};

module.exports = mongoose.model('Station', StationSchema);
