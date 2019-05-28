const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});
const uptimeThreshold = 1000 * 60 * 60 *12;

let StationSchema = mongoose.Schema({
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
    async retrieve() {
        return new Promise(async (resolve,reject) => {
            try {
                let stations = await this.find().lean().exec();
                stations = stations.map( (station) => {
                    const isOnline = (( Date.now() - station.lastChecked ) < uptimeThreshold);
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


