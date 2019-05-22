const node_ssh = require('node-ssh');

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
    
    healthCheck() {}
    backup() {}
    restore() {}
}

module.exports = Telemetry;