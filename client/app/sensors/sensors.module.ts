import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorsComponent } from './sensors.component';
import { SensorsRoutingModule } from './sensors-routing.module';
import { SensorService } from './shared/sensor/sensor.service';

import { SensorModule } from './sensor/sensor.module';

@NgModule({
  imports: [CommonModule, SensorsRoutingModule, SensorModule],
  declarations: [SensorsComponent],
  exports: [SensorsComponent],
  providers: [SensorService]
})
export class SensorsModule { }
