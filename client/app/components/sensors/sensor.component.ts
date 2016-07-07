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
  chartOptions: any = this.defaultChartOptions();
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

  private defaultChartOptions() {
    return {
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
  }

  private updateTimeRange(duration: number) {
    const now = new Date();
    let newChartOptions = this.defaultChartOptions();
    newChartOptions.scales.xAxes[0].time['min'] = new Date(now.getTime() - duration);
    newChartOptions.scales.xAxes[0].time['max'] = now;
    this.chartOptions = newChartOptions;
  }

  onLastDay() {
    this.updateTimeRange(1000 * 60 * 60 * 24);
  }

  onLastWeek() {
    this.updateTimeRange(1000 * 60 * 60 * 24 * 7);
  }

  onLastMonth() {
    this.updateTimeRange(1000 * 60 * 60 * 24 * 30);
  }

  onAllTime() {
    this.chartOptions = this.defaultChartOptions();
  }
}
