import {
  it,
  inject,
  describe,
  beforeEachProviders,
  expect
} from '@angular/core/testing';
import { provide } from '@angular/core';
import { SensorsComponent } from './sensors.component';
import { Sensor } from '../../services/sensor';
import { SensorsService } from '../../services/sensors.service';

var SENSORS: Sensor[] = [
  { _id: "123", sensor: "temperature", name: "Living room", samples: [] },
  { _id: "456", sensor: "humidity", name: "Living room", samples: [] },
  { _id: "abc", sensor: "temperature", name: "Unknown", samples: [] }
];

class MockSensorsService {
  getSensors() {
    return Promise.resolve(SENSORS);
  }
}

describe('Sensors', () => {
  beforeEachProviders(() => [
    SensorsComponent,
    provide(SensorsService, { useClass: MockSensorsService })
  ]);
  it('should work', inject([SensorsComponent], (sensors: SensorsComponent) => {
    // Add real test here
    expect(2).toBe(2);
  }));
});
