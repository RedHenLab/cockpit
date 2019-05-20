const app = require('./src/express');
const Control = require('./src/control');

const c = new Control();

const config = { 
    port: 4000,
}

app.get('/', async (req,res) => { 
    try { 
        c.listStations(req,res);
    }
    catch(err) {
        console.log(err);
    };
});

app.listen(config.port, () => {
    console.log(`Started coop on port ${config.port}`);
})