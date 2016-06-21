require('./test.js');
const request = require('supertest');
const app = require('../app.js');
const Sensor = require('../models/Sensor');
const mongoose = require('mongoose');

function addSensorData(done) {
  new Sensor({_id: mongoose.Types.ObjectId('000000000000000000000000'), key: '1234567890abcdef', sensor: 'temperature', name: 'Some name',
                 samples: [{value: 1.1, time: new Date(50)}, {value: -5.0, time: new Date(10000)}]}).save(done);
}

function setSensorData(done) {
  Sensor.remove({}, () => {
    new Sensor({_id: mongoose.Types.ObjectId('000000000000000000000000'), key: '1234567890abcdef', sensor: 'temperature', name: 'Some name',
                samples: [{value: 1.1, time: new Date(50)}, {value: -5.0, time: new Date(10000)}]}).save(done);
  });
}

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(app).get('/').expect(200, 'Hello World!', done);
  });
});

describe('GET /api/sensors', () => {
  before((done) => {
    Sensor.remove({}, done);
  });

  it('should be empty', (done) => {
    request(app).get('/api/sensors').expect('Content-Type', /json/).expect(200, [], done);
  });

  describe('with data', () => {
    before(setSensorData);

    it('should be one', (done) => {
      request(app).get('/api/sensors').expect('Content-Type', /json/).expect(200, [{_id: '000000000000000000000000', name: 'Some name', sensor: 'temperature'}], done);
    });
  });
});

describe('GET /api/sensor/:id', () => {
  before(setSensorData);

  it('should not find sensor', (done) => {
    request(app).get('/api/sensor/0').expect(400, done);
  });

  it('should find sensor', (done) => {
    request(app).get('/api/sensor/000000000000000000000000').expect(200, [{value: 1.1, time: new Date(50).toISOString()}, {value: -5, time: new Date(10000).toISOString()}], done);
  });
});