require('./test.js');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('./app.js');
const Sensor = require('./models/sensor');
const mongoose = require('mongoose');

function setSensorData(done) {
  Sensor.remove({}, () => {
    new Sensor({
      _id: mongoose.Types.ObjectId('000000000000000000000000'),
      key: '1234567890abcdef',
      sensor: 'temperature',
      name: 'Some name',
      samples: [{
        value: 1.1,
        time: 50
      }, {
        value: -5.0,
        time: 10000
      }]
    }).save(done);
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
        value: 1.1,
        time: 50
      }, {
        value: -5,
        time: 10000
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

  it('should add to existing', (done) => {
    request(app).post('/api/sensor').send('key=1234567890abcdef').send('temperature=-5.00').expect(200, () => {
      Sensor.findOne({
        _id: '000000000000000000000000'
      }, (err, sensor) => {
        expect(err).to.be.null;
        expect(sensor.key).to.equal('1234567890abcdef');
        expect(sensor.sensor).to.equal('temperature');
        expect(sensor.samples).to.have.length(3);
        expect(sensor.samples[2]).to.have.property('value', -5.0);
        done();
      });
    });
  });

  it('should remove middle sample', (done) => {
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
          expect(sensor.samples).to.have.length(3);
          expect(sensor.samples[2]).to.have.property('value', -5.0);
          expect(sensor.samples[2].time).to.not.equal(before.samples[2].time);
          done();
        });
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
