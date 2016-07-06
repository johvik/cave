/**
 * Boilerplate from https://github.com/sahat/hackathon-starter
 */
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const ms = require('ms');

dotenv.load();

const apiController = require('./controllers/api');

const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

const maxAge = ms('30 days');
const root = path.join(__dirname, '..', 'dist');

app.set('port', process.env.PORT);
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressValidator());
app.use(express.static(root, {
  maxAge: maxAge
}));

app.get('/api/sensor', apiController.getSensors);
app.get('/api/sensor/:id', apiController.getSensor);

app.post('/api/sensor', apiController.postSensor);

/* Angular routes */
const getIndex = (req, res) => {
  res.sendFile('index.html', {
    maxAge: maxAge,
    root: root
  });
};

app.get('/sensors', getIndex);
app.get('/sensors/:id', getIndex);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
