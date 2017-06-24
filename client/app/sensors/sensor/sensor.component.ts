import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';
import { SensorService } from './../shared/sensor/sensor.service';
import { Sensor, Sample } from './../shared/sensor/sensor.model';

@Component({
  selector: 'app-sensor',
  templateUrl: 'sensor.component.html'
})

export class SensorComponent implements OnInit, OnDestroy {
  sensor: Sensor;
  error: any;
  private routeStateChanged: Subscription;
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
  chartType = 'line';
  chartData: any[];

  constructor(private route: ActivatedRoute, private sensorService: SensorService) { }

  ngOnInit() {
    this.routeStateChanged = this.route.params.switchMap((params: Params) =>
      this.sensorService.getSensor(params['id'])).subscribe(sensor => {
        this.sensor = sensor;
        this.onLastDay();
    }, error => this.error = error);
  }

  ngOnDestroy() {
    this.routeStateChanged.unsubscribe();
  }

  private updateChartData(duration: number) {
    const now = new Date().getTime();
    const start = now - duration;

    // Convert to x/y data
    const xyData = this.sensor.samples.map((sample: Sample) => {
      return {
        x: sample.time,
        y: sample.value
      }
    }).filter((point) => {
      return point.x >= start && point.x <= now;
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
