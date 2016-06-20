const mongoose = require('mongoose');

const sampleSchema = mongoose.Schema({
  _id: false,
  value: Number,
  time: { type: Date, default: Date.now }
});

const sensorSchema = mongoose.Schema({
  key: String,
  name: { type: String, default: 'Unknown' },
  sensor: String,
  samples: [sampleSchema]
});

sensorSchema.index({key: 1, sensor: 1}, {unique: true});

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;