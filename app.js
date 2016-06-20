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

dotenv.load();

const homeController = require('./controllers/home');
const apiController = require('./controllers/api');

const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

app.set('port', process.env.PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compression());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.get('/', homeController.index);

app.get('/api/sensors', apiController.getSensors);
app.get('/api/sensor/:id', apiController.getSensor);

app.post('/api/sensor', apiController.postSensor);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;