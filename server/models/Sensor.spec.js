require('../test.js');
const expect = require('chai').expect;
const Sensor = require('./Sensor');

describe('Sensor Model', () => {
  before((done) => {
    Sensor.remove({}, done);
  });

  it('should create a new sensor', (done) => {
    new Sensor({key: 'abc', sensor: 'humidity'}).save((err, sensor) => {
      expect(err).to.be.null;
      expect(sensor).to.have.property('_id');
      expect(sensor).to.have.property('key', 'abc');
      expect(sensor).to.have.property('name', 'Unknown');
      expect(sensor).to.have.property('sensor', 'humidity');
      expect(sensor).to.have.property('samples');
      expect(sensor.samples).to.be.empty;
      done();
    });
  });

  it('should create a new sensor with a sample', (done) => {
    new Sensor({key: 'abc', sensor: 'temperature', samples: [{ value: 42.0 }]}).save((err, sensor) => {
      expect(err).to.be.null;
      expect(sensor).to.have.property('_id');
      expect(sensor).to.have.property('key', 'abc');
      expect(sensor).to.have.property('name', 'Unknown');
      expect(sensor).to.have.property('sensor', 'temperature');
      expect(sensor).to.have.property('samples');
      expect(sensor.samples).to.have.length(1);
      expect(sensor.samples[0]).to.have.property('value', 42.0);
      expect(sensor.samples[0]).to.have.property('time');
      expect(sensor.samples[0].time).to.be.a('Date');
      done();
    });
  });

  it('should not create a duplicate key/sensor pair', (done) => {
    new Sensor({key: 'abc', sensor: 'humidity'}).save((err, sensor) => {
      expect(err).to.exist;
      expect(err.code).to.equal(11000);
      expect(sensor).to.not.exist;
      done();
    });
  });

  it('should not create a new sensor without key', (done) => {
    new Sensor({sensor: 'humidity'}).save((err, sensor) => {
      expect(err).to.exist;
      expect(err.errors.key.kind).to.equal('required');
      expect(sensor).to.not.exist;
      done();
    });
  });

  it('should not create a new sensor without sensor', (done) => {
    new Sensor({key: 'abc'}).save((err, sensor) => {
      expect(err).to.exist;
      expect(err.errors.sensor.kind).to.equal('required');
      expect(sensor).to.not.exist;
      done();
    });
  });

  it('should create a new sensor without a sample value', (done) => {
    new Sensor({key: 'abc', sensor: 'humidity', samples: [{}]}).save((err, sensor) => {
      expect(err).to.exist;
      expect(err.errors['samples.0.value'].kind).to.equal('required');
      expect(sensor).to.not.exist;
      done();
    });
  });
});
