import {
  inject,
  addProviders
} from '@angular/core/testing';
import { provide } from '@angular/core';
import { SensorsComponent } from './sensors.component';
import { Sensor } from '../../services/sensor';
import { SensorsService } from '../../services/sensors.service';
import { MockSensorsService } from '../../services/mock-sensors.service';

describe('Sensors', () => {
  beforeEach(() => {
    addProviders([
      SensorsComponent,
      provide(SensorsService, { useClass: MockSensorsService })
    ]);
  });
  it('should work', inject([SensorsComponent], (sensors: SensorsComponent) => {
    // Add real test here
    expect(2).toBe(2);
  }));
});
