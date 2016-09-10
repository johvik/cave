import { Routes }  from '@angular/router';
import { SensorsComponent } from './sensors.component';
import { SensorComponent } from './sensor.component';

export const SensorsRoutes: Routes = [
  { path: 'sensors', component: SensorsComponent },
  { path: 'sensors/:id', component: SensorComponent }
];