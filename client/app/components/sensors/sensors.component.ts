import { Component, OnInit } from '@angular/core';

import { Sensor } from '../../services/sensor';
import { SensorsService } from '../../services/sensors.service';

@Component({
  selector: 'sensors',
  template: require('./sensors.component.html'),
  providers: [SensorsService]
})

export class SensorsComponent implements OnInit {
  sensors: Sensor[];
  error: any;

  constructor(private sensorsService: SensorsService) { }

  getSensors() {
    this.sensorsService
        .getSensors()
        .then(sensors => this.sensors = sensors)
        .catch(error => this.error = error);
  }

  ngOnInit() {
    this.getSensors();
  }
}
