'use strict';
const Sensor = require('../models/sensor');
const validator = require('validator');
const async = require('async');

exports.getSensors = (req, res) => {
  Sensor.find()
    .select('_id name sensor')
    .lean()
    .exec((err, sensors) => {
      if (err) {
        return res.sendStatus(400);
      }
      return res.json(sensors);
    });
};

exports.getSensor = (req, res) => {
  Sensor.findOne({
      _id: req.params.id
    })
    .select('_id name sensor samples')
    .lean()
    .exec((err, sensor) => {
      if (err || !sensor) {
        return res.sendStatus(400);
      }
      return res.json(sensor);
    });
};

/*
 * Removes the last sample for the sensor if the last two values equals to value
 */
function removeLastIfEqual(key, sensor, value, done) {
  Sensor.findOne({
    key: key,
    sensor: sensor
  }, {
    samples: {
      $slice: -2
    }
  }, (error, doc) => {
    if (error) {
      return done();
    }
    if (doc && doc.samples.length == 2 && doc.samples[0].value == value && doc.samples[1].value == value) {
      // All three are the same, remove last in the array
      return Sensor.update({
        key: key,
        sensor: sensor
      }, {
        $pop: {
          samples: 1
        }
      }, done);
    } else {
      return done();
    }
  });
}

exports.postSensor = (req, res) => {
  req.checkBody('key').notEmpty().isHexadecimal();
  const errors = req.validationErrors();
  if (errors) {
    return res.sendStatus(400);
  }

  const key = req.body.key;
  delete req.body.key;

  async.forEachOf(req.body, (value, sensor, callback) => {
    if (!validator.isAlphanumeric(sensor) || !validator.isDecimal(value)) {
      callback('Bad input');
    } else {
      removeLastIfEqual(key, sensor, value, () => {
        Sensor.update({
          key: key,
          sensor: sensor
        }, {
          $push: {
            samples: {
              $each: [{
                value: value
              }],
              $slice: -60 * 24 * 30 // One sample / min for one month
            }
          }
        }, {
          upsert: true
        }, callback);
      });
    }
  }, (err) => {
    if (err) {
      return res.sendStatus(400);
    } else {
      return res.sendStatus(200);
    }
  });
};
