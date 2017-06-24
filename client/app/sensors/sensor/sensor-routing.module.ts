import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SensorComponent } from './sensor.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'sensors/:id', component: SensorComponent }
    ])
  ],
  exports: [RouterModule]
})
export class SensorRoutingModule { }
