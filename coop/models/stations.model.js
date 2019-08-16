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
  ssh_username: String,
  incharge_name: String,
  incharge_email: String,
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
          const isOnline = (station.lastChecked) ? ((Date.now() - station.lastChecked) < uptimeThreshold) : false;
          const { _id, name, location, host, port, ssh_username, lastBackup, lastChecked, onlineSince, incharge_name, incharge_email } = station;
          return { _id, name, location, host, port, ssh_username, lastBackup, lastChecked, isOnline, onlineSince, incharge_name, incharge_email };
        });
        resolve(stations);
      }
      catch (err) { reject(err); }
    });
  },
};

module.exports = mongoose.model('Station', StationSchema);
