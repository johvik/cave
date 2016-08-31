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
          this.sensor = sensor;
          this.onLastDay();
        })
        .catch(error => this.error = error);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private updateChartData(duration: number) {
    const now = new Date().getTime();
    const start = now - duration;

    // Convert to x/y data
    const xyData = this.sensor.samples.map((sample: Sample) => {
      return {
        x: new Date(sample.time).getTime(),
        y: sample.value
      }
    }).filter((point) => {
      return point.x >= start && point.x <= now;
    }).filter((point, index, array) => {
      // Remove points where the previous and next are equal to current
      return index <= 0 || index + 1 >= array.length ||
        array[index - 1].y != point.y || point.y != array[index + 1].y;
    });
    this.chartData = [{
      label: this.sensor.sensor,
      fill: false,
      lineTension: 0,
      borderWidth: 1,
      pointRadius: 0,
      pointHitRadius: 2,
      data: xyData
    }];
  }

  onLastDay() {
    this.updateChartData(1000 * 60 * 60 * 24);
  }

  onLastWeek() {
    this.updateChartData(1000 * 60 * 60 * 24 * 7);
  }

  onLastMonth() {
    this.updateChartData(1000 * 60 * 60 * 24 * 30);
  }
}
