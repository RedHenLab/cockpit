const mongoose = require('mongoose');
const app = require('./config/express');
const passport = require('./config/passport');
const Control = require('./src/control');
const User = require('./models/user.model');

const config = require('./config');
const auth = require('./config/auth');

mongoose.connect(config.mongo, { useNewUrlParser: true });

function handle(middleware) {
  return async (req, res) => {
    try {
      await middleware(req, res);
    }
    catch (err) {
      console.log(err);
      res.json(err);
    }
  };
}
app.get('/list', auth, handle(Control.listStations));
app.post('/refresh', auth, handle(Control.refreshStationInfo));
app.post('/add', auth, Control.addStation);
app.post('/edit', auth, handle(Control.editStation));
app.post('/report', auth, handle(Control.runDiagnostics));
app.post('/delete', auth, handle(Control.deleteStation));
app.post('/backup', auth, handle(Control.triggerBackup));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send({ message: err.message });
  }
});

app.get('/login', (req, res, next) => {
  if (!req.query.username) {
    return res.status(422).json({ message: "Username can't be blank" });
  }

  if (!req.query.password) {
    return res.status(422).json({ message: "Password can't be blank" });
  }

  return passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) { return next(err); }

    if (user) { return res.json(user.toAuthJSON()); }

    return res.status(422).json(info);
  })(req, res, next);
});

app.get('/user', auth, (req, res, next) => {
  User.findById(req.user.id).then((user) => {
    if (!user) { return res.sendStatus(401); }

    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
});

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  app.listen(config.port, () => {
    console.log(`Started coop on port ${config.port}`);
  });
}

// For testing the app with mocha
module.exports = app;
