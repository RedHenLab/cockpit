const mongoose = require('mongoose');
const app = require('./src/express');
const Control = require('./src/control');

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

const c = new Control();

/* TODO: migrate to .env */
const config = { 
    port: 4000,
}

function handle(middleware) { 
    return async (req, res) => { 
        try { 
            await middleware(req, res)
        }
        catch (err) { 
            console.log(err);
            res.json(err);
        }
    }
}

app.get('/list', handle(c.listStations));
app.post('/refresh', handle(c.refreshStationInfo));
app.post('/add', c.addStation);
app.post('/edit', handle(c.editStation));
app.post('/report', handle(c.runDiagnostics));

app.listen(config.port, () => {
    console.log(`Started coop on port ${config.port}`);
})