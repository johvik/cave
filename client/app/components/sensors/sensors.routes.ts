import { RouterConfig }  from '@angular/router';
import { SensorsComponent } from './sensors.component';
import { SensorComponent } from './sensor.component';

export const SensorsRoutes: RouterConfig = [
  { path: 'sensors', component: SensorsComponent },
  { path: 'sensors/:id', component: SensorComponent }
];
