import {
  inject,
  addProviders
} from '@angular/core/testing';
import { provide } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SensorComponent } from './sensor.component';
import { Sensor } from '../../services/sensor';
import { SensorsService } from '../../services/sensors.service';
import { MockSensorsService } from '../../services/mock-sensors.service';

class MockActivatedRoute { }

describe('Sensor', () => {
  beforeEach(() => {
    addProviders([
      SensorComponent,
      provide(SensorsService, { useClass: MockSensorsService }),
      provide(ActivatedRoute, { useClass: MockActivatedRoute })
    ]);
  });
  it('should work', inject([SensorComponent], (sensor: SensorComponent) => {
    // Add real test here
    expect(2).toBe(2);
  }));
});
