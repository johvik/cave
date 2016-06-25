import { provideRouter, RouterConfig }  from '@angular/router';

import { HomeRoutes } from './components/home/home.routes';
import { SensorsRoutes } from './components/sensors/sensors.routes';

export const routes: RouterConfig = [
  { path: '', redirectTo: '/home', terminal: true },
  ...HomeRoutes,
  ...SensorsRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
