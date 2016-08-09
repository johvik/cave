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
      Sensor.update({
        key: key,
        sensor: sensor
      }, {
        $push: {
          samples: {
            value: value
          }
        }
      }, {
        upsert: true
      }, callback);
    }
  }, (err) => {
    if (err) {
      return res.sendStatus(400);
    } else {
      return res.sendStatus(200);
    }
  });
};
