import {
  it,
  inject,
  describe,
  beforeEachProviders,
  expect
} from '@angular/core/testing';
import { SensorsComponent } from './sensors.component';
describe('Sensors', () => {
  beforeEachProviders(() => [
    SensorsComponent
  ]);
  it ('should work', inject([SensorsComponent], (sensors: SensorsComponent) => {
    // Add real test here
    expect(2).toBe(2);
  }));
});
