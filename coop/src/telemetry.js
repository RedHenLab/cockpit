const node_ssh = require('node-ssh');
const SSHConfig = require('ssh-config');
const path = require('path');

const fs = require('fs');
/**
 * @class Telemetry
 * Provides interface to communicate with capture stations
 */
class Telemetry {
  /**
   *  @param {Station} station - contains hostname that can be read from ssh config file
   */
  // eslint-disable-next-line no-unused-vars
  constructor(station) {
    const conf = SSHConfig.parse(fs.readFileSync(path.resolve(__dirname, './../config/sshconfig'), 'utf8'));
    const cred = conf.compute('cartago');
    this.credential = {
      host: cred.Hostname,
      username: cred.User,
      privateKey: fs.readFileSync(path.resolve(__dirname, './../config/id_rsa'), 'utf8'),
    };
  }

  /**
   *  Check if station is online and run the uptime command
   *  @return {Promise<Date>} Promise containing JS Date Object generated from the uptime command
   */
  async statusCheck() {
    const ssh = new node_ssh();
    this.ssh = ssh;
    return new Promise(async (resolve, reject) => {
      try {
        await ssh.connect(this.credential);
        const uptime = await ssh.exec('bash space/status.sh');
        resolve(new Date(uptime));
      }
      catch (err) {
        reject(err);
      }
      finally {
        this.close();
      }
    });
  }

  /**
   *  Close ssh connection
   */
  close() {
    this.ssh.dispose();
  }

  /**
   *  Run the health check report script on the capture station
   *  @returns {Promise<Report>} Promise that returns the generated Report object
   */
  async healthCheck() {
    const ssh = new node_ssh();
    this.ssh = ssh;

    return new Promise(async (resolve, reject) => {
      try {
        await ssh.connect(this.credential);
        await ssh.exec('cd space; bash callreport.sh');
        const report = await ssh.exec('cat space/report.json');
        return resolve(JSON.parse(report));
      }
      catch (err) {
        console.log(err);
        return reject(err);
      }
      finally {
        this.close();
      }
    });
  }

  async backup() {
    const ssh = new node_ssh();
    this.ssh = ssh;

    return new Promise(async (resolve, reject) => {
      try {
        await ssh.connect(this.credential);
        await ssh.exec('cd space; bash callbackup.sh');
        resolve();
      }
      catch (err) {
        reject(err);
      }
      finally {
        this.close();
      }
    });
  }
}

module.exports = Telemetry;
