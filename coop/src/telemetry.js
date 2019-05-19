const node_ssh = require('node-ssh');
const ssh = new node_ssh()

/*
 * Telemetry class provides interface to communicate with capture stations
 */
class Telemetry { 
    connect() {
        ssh.connect({
            host: '',
            username: '',
            password: ''
        })
        .then(() => { 
            console.log('Connected');
            ssh.exec('uptime').then((stream) => {
                console.log(stream);
                ssh.dispose();
            })
        })
        .catch((e) => {
            console.log('Error Connecting ');
            console.log(e);
        })
    }
    runScript() { 
        this.connect();
    }

    healthCheck() {}
    backup() {}
    restore() {}
}

module.exports = Telemetry;