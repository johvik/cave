import { provideRouter, RouterConfig }  from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { SensorsComponent } from './components/sensors/sensors.component';

export const routes: RouterConfig = [
  { path: '', redirectTo: '/home', terminal: true },
  { path: 'home', component: HomeComponent },
  { path: 'sensors', component: SensorsComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
