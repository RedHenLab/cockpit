const mongoose = require('mongoose');

/**
 * Mongoose schema for capture station health check reports
 */
let ReportSchema = new mongoose.Schema({
    stationId: { type: 'ObjectId'},
    disks: [{
        name: String,
        available: Number,
        used: Number,
        smart_enabled: Boolean,
        smart_report: { 
            status: String,
            lifetime: Number
        },
    }],
    cards: [{
        available: Number,
        name: String,
        used: Number
    }],
    network: {
        log_start: Date,
        log_end: Date,
        downtimes: [{
            start: Date,
            end: Date
        }],
    },
    hdhomerun_devices: [{
        id: String,
        ip: String
    }],
    security: {
        failed_login: Number
    },
    generated_at: Date,
    fetched_at: Date,
    errorsLog: []
})

ReportSchema.statics = { 
    async retrieve() {
        return new Promise(async (resolve,reject) => {
        });
    }
} 

module.exports = mongoose.model('Report',ReportSchema);
