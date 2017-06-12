require('./test.js');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('./app.js');
const Sensor = require('./models/sensor');
const mongoose = require('mongoose');

const now = Date.now()

function setSensorData(done) {
  Sensor.remove({}, () => {
    new Sensor({
      _id: mongoose.Types.ObjectId('000000000000000000000000'),
      key: '1234567890abcdef',
      sensor: 'temperature',
      name: 'Some name',
      samples: [{
        value: 0.1,
        time: 10
      }, {
        value: 2.1,
        time: 50
      }, {
        value: 1.5,
        time: 10000
      }, {
        value: 1.1,
        time: now - 1000
      }, {
        value: -5.0,
        time: now - 50
      }]
    }).save((err) => {
      if (err) {
        return done(err);
      }
      new Sensor({
        _id: mongoose.Types.ObjectId('000000000000000000000001'),
        key: '1234567890abcdee',
        sensor: 'temperature',
        name: 'First name',
        samples: []
      }).save(done);
    });
  });
}

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(app).get('/').expect(200, done);
  });
});

describe('GET /api/sensor', () => {
  before((done) => {
    Sensor.remove({}, done);
  });

  it('should be empty', (done) => {
    request(app).get('/api/sensor').expect('Content-Type', /json/).expect(200, [], done);
  });

  describe('with data', () => {
    before(setSensorData);

    it('should be one', (done) => {
      request(app).get('/api/sensor').expect('Content-Type', /json/).expect(200, [{
        _id: '000000000000000000000001',
        name: 'First name',
        sensor: 'temperature'
      }, {
        _id: '000000000000000000000000',
        name: 'Some name',
        sensor: 'temperature'
      }], done);
    });
  });
});

describe('GET /api/sensor/:id', () => {
  before(setSensorData);

  it('should not find sensor', (done) => {
    request(app).get('/api/sensor/0').expect(400, done);
  });

  it('should find sensor', (done) => {
    request(app).get('/api/sensor/000000000000000000000000').expect(200, {
      _id: '000000000000000000000000',
      name: 'Some name',
      sensor: 'temperature',
      samples: [{
        value: 0.1,
        time: 10
      }, {
        value: 2.1,
        time: 50
      }, {
        value: 1.5,
        time: 10000
      }, {
        value: 1.1,
        time: now - 1000
      }, {
        value: -5,
        time: now - 50
      }]
    }, done);
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

  it('should not accept a non-alphanumeric sensor', (done) => {
    request(app).post('/api/sensor').send('key=0').send('sensor_0=10.0').expect(400, done);
  });

  it('should not accept a non-decimal value', (done) => {
    request(app).post('/api/sensor').send('key=0').send('temperature=string').expect(400, done);
  });

  it('should accept no data', (done) => {
    request(app).post('/api/sensor').send('key=0').expect(200, done);
  });

  it('should add to existing and remove oldest', (done) => {
    request(app).post('/api/sensor').send('key=1234567890abcdef').send('temperature=-5.00').expect(200, () => {
      Sensor.findOne({
        _id: '000000000000000000000000'
      }, (err, sensor) => {
        expect(err).to.be.null;
        expect(sensor.key).to.equal('1234567890abcdef');
        expect(sensor.sensor).to.equal('temperature');
        expect(sensor.name).to.equal('Some name');
        expect(sensor.samples[0].value).to.equal(2.1);
        expect(sensor.samples[0].time).to.equal(50);
        expect(sensor.samples).to.have.length(5);
        expect(sensor.samples[sensor.samples.length - 1]).to.have.property('value', -5.0);
        done();
      });
    });
  });

  it('should remove middle sample and remove oldest', (done) => {
    Sensor.findOne({
      _id: '000000000000000000000000'
    }, (err1, before) => {
      expect(err1).to.be.null;
      request(app).post('/api/sensor').send('key=1234567890abcdef').send('temperature=-5.00').expect(200, () => {
        Sensor.findOne({
          _id: '000000000000000000000000'
        }, (err2, sensor) => {
          expect(err2).to.be.null;
          expect(sensor.key).to.equal('1234567890abcdef');
          expect(sensor.sensor).to.equal('temperature');
          expect(sensor.name).to.equal('Some name');
          expect(sensor.samples[0].value).to.equal(1.5);
          expect(sensor.samples[0].time).to.equal(10000);
          expect(sensor.samples).to.have.length(4);
          expect(sensor.samples[sensor.samples.length - 1]).to.have.property('value', -5.0);
          expect(sensor.samples[sensor.samples.length - 1].time).to.not.equal(before.samples[before.samples.length - 1].time);
          done();
        });
      });
    });
  });

  it('should add to existing and but not remove oldest', (done) => {
    request(app).post('/api/sensor').send('key=1234567890abcdef').send('temperature=10.00').expect(200, () => {
      Sensor.findOne({
        _id: '000000000000000000000000'
      }, (err, sensor) => {
        expect(err).to.be.null;
        expect(sensor.key).to.equal('1234567890abcdef');
        expect(sensor.sensor).to.equal('temperature');
        expect(sensor.name).to.equal('Some name');
        expect(sensor.samples[0].value).to.equal(1.5);
        expect(sensor.samples[0].time).to.equal(10000);
        expect(sensor.samples).to.have.length(5);
        expect(sensor.samples[sensor.samples.length - 1]).to.have.property('value', 10);
        done();
      });
    });
  });

  describe('empty DB', () => {
    before((done) => {
      Sensor.remove({}, done);
    });

    it('should create a new one', (done) => {
      request(app).post('/api/sensor').send('key=1234567890abcdef').send('temperature=99').expect(200, () => {
        Sensor.findOne({}, (err, sensor) => {
          expect(err).to.be.null;
          expect(sensor.key).to.equal('1234567890abcdef');
          expect(sensor.sensor).to.equal('temperature');
          expect(sensor.name).to.equal('Unknown');
          expect(sensor.samples).to.have.length(1);
          expect(sensor.samples[0]).to.have.property('value', 99);
          done();
        });
      });
    });

    it('should add to existing', (done) => {
      request(app).post('/api/sensor').send('key=1234567890abcdef').send('temperature=99').expect(200, () => {
        Sensor.findOne({}, (err, sensor) => {
          expect(err).to.be.null;
          expect(sensor.key).to.equal('1234567890abcdef');
          expect(sensor.sensor).to.equal('temperature');
          expect(sensor.name).to.equal('Unknown');
          expect(sensor.samples).to.have.length(2);
          expect(sensor.samples[1]).to.have.property('value', 99);
          done();
        });
      });
    });

    it('should remove middle sample', (done) => {
      Sensor.findOne({}, (err1, before) => {
        expect(err1).to.be.null;
        request(app).post('/api/sensor').send('key=1234567890abcdef').send('temperature=99').expect(200, () => {
          Sensor.findOne({}, (err2, sensor) => {
            expect(err2).to.be.null;
            expect(sensor.key).to.equal('1234567890abcdef');
            expect(sensor.sensor).to.equal('temperature');
            expect(sensor.name).to.equal('Unknown');
            expect(sensor.samples).to.have.length(2);
            expect(sensor.samples[1]).to.have.property('value', 99);
            expect(sensor.samples[1].time).to.not.equal(before.samples[1].time);
            done();
          });
        });
      });
    });
  });
});

describe('GET additional /', () => {
  it('GET /sensors should return 200 OK', (done) => {
    request(app).get('/sensors').expect(200, done);
  });

  it('GET /sensors/:id should return 200 OK', (done) => {
    request(app).get('/sensors/123').expect(200, done);
  });

  it('GET /whatever should return 200 OK', (done) => {
    request(app).get('/whatever').expect(404, done);
  });
});
