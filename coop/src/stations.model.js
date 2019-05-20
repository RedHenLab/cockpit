const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});
const uptimeThreshold = 1000 * 60 * 30;

let StationSchema = mongoose.Schema({
    name: String,
    location: String,
    host: String,
    port: String,
    username: String,
    password: String,
    lastOnline: Date,
    lastBackup: Date,
    uptime: Date,
})

StationSchema.statics = { 
    async retrieve() {
        return new Promise(async (resolve,reject) => {
            try {
                let stations = await this.find().lean().exec();
                stations = stations.map( (station) => {
                    const isOnline = (( Date.now() - station.lastOnline ) < uptimeThreshold);
                    return {
                        _id: station._id,
                        name: station.name,
                        location: station.location,
                        lastOnline: station.lastOnline,
                        lastBackup: station.lastBackup,
                        isOnline
                    }
                });
                resolve(stations);
            }
            catch (err) { reject(err); }
        });
    }
} 

module.exports = mongoose.model('Station',StationSchema);


