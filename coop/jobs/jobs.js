const Agenda = require('agenda');
const config = require('../config/');

const Station = require('../models/stations.model');
const Control = require('../src/control');

const agenda = new Agenda({ db: { address: config.mongo } });

function generateReports() {
  Station.find().exec()
    .then(stations => stations.forEach((station) => {
      Control.generateReport(station)
        .catch(err => console.log(`[Jobs Error] Could generate report for ${station.name}: ${err.message}`));
    }));
}

function refreshStations() {
  Station.find()
    .exec()
    .then(stations => stations.forEach((station) => {
      Control.refreshStation(station)
        .catch(err => console.log(`[Jobs Error] Could not refresh ${station.name}: ${err.message}`));
    }));
}

agenda.define('Generate all reports', generateReports);
agenda.define('Refresh all stations', refreshStations);

module.exports = async function schedule() {
  await agenda.start();
  await agenda.every('15 minutes', 'Refresh all stations');
  await agenda.every('24 hours', 'Generate all reports');
};
