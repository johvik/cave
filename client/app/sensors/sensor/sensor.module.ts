import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorComponent } from './sensor.component';
import { SensorRoutingModule } from './sensor-routing.module';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@NgModule({
  imports: [CommonModule, SensorRoutingModule, ChartsModule],
  declarations: [SensorComponent],
  exports: [SensorComponent],
  providers: []
})
export class SensorModule { }
