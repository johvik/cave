import { Component, OnInit } from '@angular/core';
import { SensorService } from './shared/sensor/sensor.service';
import { Sensor } from './shared/sensor/sensor.model';

@Component({
  selector: 'app-sensors',
  templateUrl: 'sensors.component.html'
})

export class SensorsComponent implements OnInit {
  sensors: Sensor[];
  error: any;

  constructor(private sensorService: SensorService) { }

  ngOnInit() {
    this.sensorService.getSensors().then(sensors => this.sensors = sensors).catch(error => this.error = error);
  }
}
