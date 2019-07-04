const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const app = require('./src/express');
const Control = require('./src/control');
 
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

passport.use(new LocalStrategy(
   (username, password, done) => {
       
   }
));

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

app.get('/list', /*passport.authenticate('local'),*/ handle(c.listStations));
app.post('/refresh', handle(c.refreshStationInfo));
app.post('/add', c.addStation);
app.post('/edit', handle(c.editStation));
app.post('/report', handle(c.runDiagnostics));
app.post('/delete',handle(c.deleteStation))

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
    app.listen(config.port, () => {
        console.log(`Started coop on port ${config.port}`);
    })
}

// For testing the app with mocha
module.exports = app;