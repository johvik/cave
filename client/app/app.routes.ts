import { provideRouter, RouterConfig }  from '@angular/router';

import { SensorsRoutes } from './components/sensors/sensors.routes';

export const routes: RouterConfig = [
  { path: '', redirectTo: '/sensors', terminal: true },
  ...SensorsRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
