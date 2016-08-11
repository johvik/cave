import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { SensorsComponent } from './components/sensors/sensors.component';
import { SensorComponent } from './components/sensors/sensor.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing
  ],
  declarations: [
    AppComponent,
    SensorsComponent,
    SensorComponent
  ],
  providers: [
    HTTP_PROVIDERS
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
