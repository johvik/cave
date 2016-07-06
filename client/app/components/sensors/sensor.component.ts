import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';

import { Sensor, Sample } from '../../services/sensor';
import { SensorsService } from '../../services/sensors.service';

@Component({
  selector: 'sensors',
  template: require('./sensor.component.html'),
  directives: [CHART_DIRECTIVES],
  providers: [SensorsService]
})

export class SensorComponent implements OnInit, OnDestroy {
  sensor: Sensor;
  error: any;
  private sub: any;
  chartOptions: any = {
    legend: {
      display: false
    },
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          tooltipFormat: 'YYYY-MM-DD hh:mm'
        }
      }]
    }
  };
  chartType: string = 'line';
  chartData: any[];

  constructor(
    private route: ActivatedRoute,
    private sensorsService: SensorsService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      this.sensorsService.getSensor(id)
        .then(sensor => {
          // Convert to x/y data
          const xyData = sensor.samples.map((sample: Sample) => {
            return {
              x: sample.time,
              y: sample.value
            }
          });
          this.chartData = [{
            label: sensor.sensor,
            fill: false,
            lineTension: 0,
            data: xyData
          }];
          this.sensor = sensor
        })
        .catch(error => this.error = error);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
