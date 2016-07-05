import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertComponent } from 'ng2-bootstrap';

import { Sensor } from '../../services/sensor';
import { SensorsService } from '../../services/sensors.service';

@Component({
  selector: 'sensors',
  template: require('./sensor.component.html'),
  directives: [AlertComponent],
  providers: [SensorsService]
})

export class SensorComponent implements OnInit, OnDestroy {
  sensor: Sensor;
  error: any;
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private sensorsService: SensorsService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      this.sensorsService.getSensor(id)
        .then(sensor => this.sensor = sensor)
        .catch(error => this.error = error);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
