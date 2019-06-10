const node_ssh = require('node-ssh');
const SSHConfig = require('ssh-config');
const fs = require('fs')

/*
 * Telemetry provides interface to communicate with capture stations
 */
class Telemetry {
    constructor({ host, username, password}) { 
        this.credential = {host, username, password};
    }

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

    close() { 
        this.ssh.dispose();
    }
    
    async healthCheck() {
        const ssh = new node_ssh();
        this.ssh = ssh;
        const conf = SSHConfig.parse(fs.readFileSync('/home/aniruddha/.ssh/config', 'utf8'));
        const cred = conf.compute('cartago');
        console.log(cred);

        return new Promise(async(resolve, reject) => {
            try { 
                await ssh.connect({ host:cred.Hostname, username: cred.User, privateKey: require('fs').readFileSync('/home/aniruddha/.ssh/id_rsa', 'utf8') })
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