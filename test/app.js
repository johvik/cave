require('./test.js');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app.js');
const Sensor = require('../models/Sensor');
const mongoose = require('mongoose');

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

describe('POST /api/sensor', () => {
  before(setSensorData);

  it('should not accept empty key', (done) => {
    request(app).post('/api/sensor').send('key=').expect(400, done);
  });

  it('should not accept a non-hexadecimal key', (done) => {
    request(app).post('/api/sensor').send('key=g').expect(400, done);
  });

  it('should not accept no key', (done) => {
    request(app).post('/api/sensor').expect(400, done);
  });

  it('should accept no data', (done) => {
    request(app).post('/api/sensor').send('key=0').expect(200, done);
  });

  it('should add to existing', (done) => {
    request(app).post('/api/sensor').send('key=1234567890abcdef').send('temperature=99.9').expect(200, () => {
      Sensor.findOne({_id: '000000000000000000000000'}, (err, sensor) => {
        expect(err).to.be.null;
        expect(sensor.key).to.equal('1234567890abcdef');
        expect(sensor.sensor).to.equal('temperature');
        expect(sensor.samples).to.have.length(3);
        expect(sensor.samples[2]).to.have.property('value', 99.9);
        done();
      });
    });
  });
});