const mongoose = require('mongoose');

const sampleSchema = mongoose.Schema({
  _id: false,
  value: { type: Number, required: true },
  time: { type: Date, default: Date.now }
});

const sensorSchema = mongoose.Schema({
  key: { type: String, required: true },
  name: { type: String, default: 'Unknown' },
  sensor: { type: String, required: true} ,
  samples: [sampleSchema]
});

sensorSchema.index({key: 1, sensor: 1}, {unique: true});

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;
