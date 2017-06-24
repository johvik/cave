import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SensorsComponent } from './sensors.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: '/sensors', pathMatch: 'full' },
      { path: 'sensors', component: SensorsComponent }
    ])
  ],
  exports: [RouterModule]
})
export class SensorsRoutingModule { }
