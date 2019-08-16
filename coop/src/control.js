const Telemetry = require('./telemetry');
const Station = require('../models/stations.model');
const Report = require('../models/report.model');
const User = require('../models/user.model');
const mailer = require('../config/mailer');

class Control {
  /**
   * List all the Red Hen capture sations whose config information is currently present in DB.
   */
  // TODO: Make a middleware for finding stations
  static async listStations(req, res) {
    const stations = await Station.retrieve();
    return res.json(stations);
  }

  /**
   * Check if capture station is online and refresh its status information in the DB.
   */
  static async refreshStationInfo(req, res) {
    const station = await Station.findOne({ _id: req.body._id }).exec();
    if (!station) res.status(400).json({ error: 'Station not found' });

    const tele = new Telemetry(station);
    const date = await tele.statusCheck();
    station.lastChecked = new Date();
    station.onlineSince = date;
    await station.save();

    // TODO : make this part of model
    const stationObj = station.toObject();
    stationObj.isOnline = Boolean(date);

    return res.json(stationObj);
  }

  /**
   * Run the preloaded diagnostic health check script on the capture station.
   */
  static async runDiagnostics(req, res) {
    const station = await Station.findOne({ _id: req.body._id }).exec();
    if (Object.prototype.hasOwnProperty.call(req.body, 'provideLatest') && req.body.provideLatest === true) {
      const report = await Control.generateReport(station);
      return res.json(report);
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'archive') && req.body.archive === true) {
      const report = await Report.find({ stationId: req.body._id }).sort({ $natural: -1 });
      return res.json(report);
    }

    const report = await Report.find({ stationId: req.body._id }).limit(1).sort({ $natural: -1 });
    return res.json(report);
  }

  static async generateReport(station) {
    const tele = new Telemetry(station);
    const freshReport = await tele.healthCheck();
    const report = new Report();
    report.stationId = station._id;
    report.disks = freshReport.storage.disks;
    report.cards = freshReport.storage.cards;
    report.hdhomerun_devices = freshReport.hdhomerun_devices;
    report.security = freshReport.security;
    report.errors = freshReport.errors;
    // TODO: decide created at
    report.generated_at = freshReport.created_at;
    report.fetched_at = new Date();
    report.network.log_start = new Date(Number.parseInt(freshReport.network.log_start) * 1000);
    report.network.log_end = new Date(Number.parseInt(freshReport.network.log_end) * 1000);
    if (freshReport.network.downtimes) {
      const downtimes = [];
      freshReport.network.downtimes.forEach((downtime) => {
        const start = new Date(Number.parseInt(downtime.start) * 1000);
        const end = new Date(Number.parseInt(downtime.end) * 1000);
        downtimes.push({ start, end });
      });
      report.network.downtimes = downtimes;
    }
    await report.save();
    Control.sendReport(report, station);
    return report;
  }

  /**
   * Start the backup script in background and exit.
   */
  static async triggerBackup(req, res) {
    const station = await Station.findOne({ _id: req.body._id }).exec();
    if (!station) return res.status(400).json({ error: 'Station not found' });
    const tele = new Telemetry(station);
    await tele.backup();
    return res.status(200);
  }

  /**
   * Add a new capture station to DB
   */
  static addStation(req, res) {
    const { name, location, host, port, ssh_username, incharge_email, incharge_name } = req.body;
    Station.create({ name, location, host, port, ssh_username, incharge_email, incharge_name },
      (err, obj) => {
        if (err) return res.status(400).json(err);
        return res.json(obj);
      });
  }

  /**
   * Edit an existing capture station
   * name, location, host, port and ssh_username are editable
  */
  static async editStation(req, res) {
    const { _id, name, location, host, port, ssh_username,
      incharge_name, incharge_email } = req.body;
    const station = await Station.findOne({ _id }).exec();
    if (!station) res.status(400).json({ error: 'Station not found' });

    station.name = name;
    station.location = location;
    station.host = host;
    station.port = port;
    station.ssh_username = ssh_username;
    station.incharge_name = incharge_name;
    station.incharge_email = incharge_email;
    await station.save();
    return res.json(station);
  }

  /**
   * Remove existing capture station from db
   */
  static async deleteStation(req, res) {
    const station = await Station.findOneAndDelete({ _id: req.body._id }).exec();
    if (!station) res.status(400).json({ error: 'Station not found' });

    return res.json(station);
  }

  /**
   * Notifies the station incharge + all admins by email if report raises flags
   * @param {*} report
   */
  static async sendReport(report, station) {
    const errors = [];
    // There is a network downtime
    if (report.network.downtimes && report.network.downtimes.length > 0) {
      errors.push('[!] A network downtime has occurred');
    }
    // If there are no HDHomeRuns connected
    if (report.hdhomerun_devices.length === 0) {
      errors.push('[!] No HDHomeRun devices were found');
    }
    // Less than 20% storage space in any disk
    report.disks.forEach((disk) => {
      const percentUsed = disk.used / (disk.used + disk.available);
      if (percentUsed > 0.8) {
        errors.push(`[!] A disk is almost full - ${disk.name} is ${percentUsed * 100}% used`);
      }
    });
    if (errors.length > 0) {
      console.log('Mailing');
      const subject = `Alert raised by latest health report from ${station.name}`;
      const text = `The latest health report raised some error flags:\n\n
      ${errors.join('\n')}\n
      Report fetched at ${report.fetched_at}\n
      To see more, check Cockpit`;

      const admins = await User.find({ role: 'admin' });
      const emails = admins.map(user => user.email);
      if (!emails.contains(station.incharge_email)) emails.push(station.incharge_email);
      // if there is any error send an email
      mailer.sendMail({
        from: '"Red Hen Lab Cockpit" <noreply@cockpit>',
        bcc: emails.join(','),
        subject,
        text,
      }).catch(err => console.log(err));
    }
  }
}

module.exports = Control;
