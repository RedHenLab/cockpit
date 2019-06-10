const mongoose = require('mongoose');

let ReportSchema = mongoose.Schema({
    stationId: { type: 'ObjectId'},
    disks: [{
        available: Number,
        name: String,
        used: Number      
    }],
    cards: [{
        available: Number,
        name: String,
        used: Number
    }],
    hdhomerun_devices: [{
        id: String,
        ip: String
    }],
    security: {
        failed_login: Number
    }
})

ReportSchema.statics = { 
    async retrieve() {
        return new Promise(async (resolve,reject) => {
        });
    }
} 

module.exports = mongoose.model('Report',ReportSchema);
