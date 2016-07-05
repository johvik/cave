import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { Sensor } from '../../services/sensor';
import { SensorsService } from '../../services/sensors.service';

@Component({
  selector: 'sensors',
  template: require('./sensors.component.html'),
  directives: [ROUTER_DIRECTIVES],
  providers: [SensorsService]
})

export class SensorsComponent implements OnInit {
  sensors: Sensor[];
  error: any;

  constructor(private sensorsService: SensorsService) { }

  ngOnInit() {
    this.sensorsService
      .getSensors()
      .then(sensors => this.sensors = sensors)
      .catch(error => this.error = error);
  }
}
