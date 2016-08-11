import { Routes, RouterModule }  from '@angular/router';

import { SensorsRoutes } from './components/sensors/sensors.routing';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/sensors', terminal: true },
  ...SensorsRoutes
];

export const routing = RouterModule.forRoot(appRoutes);
