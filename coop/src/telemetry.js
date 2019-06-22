const node_ssh = require('node-ssh');
const SSHConfig = require('ssh-config');
const fs = require('fs')

/**
 * @class Telemetry 
 * Provides interface to communicate with capture stations
 */
class Telemetry {
    /**
     *  @param {string} host - hostname that can be read from ssh config file 
     */
    constructor(host) { 
        const conf = SSHConfig.parse(fs.readFileSync('/home/aniruddha/.ssh/config', 'utf8'));
        const cred = conf.compute(host);
        this.credential = {
            host:cred.Hostname, 
            username: cred.User, 
            privateKey: require('fs').readFileSync('/home/aniruddha/.ssh/id_rsa', 'utf8') 
        }
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
                const uptime = await ssh.exec('uptime --since');
                resolve(new Date(uptime));
            } 
            catch (err) {
                reject(err);
            }
            finally { 
                this.close();
            }
        })
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

        return new Promise(async(resolve, reject) => {
            try { 
                await ssh.connect(this.credential);
                await ssh.exec('cd space; bash callreport.sh');
                const report = await ssh.exec('cat space/report.json');
                resolve(JSON.parse(report));
            } 
            catch (err) { 
                reject(err);
            }
            finally { 
                this.close();
            }
        })
    }

    backup() {}
    restore() {}
}

module.exports = Telemetry;