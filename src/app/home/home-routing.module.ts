import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { SimulationComponent } from '../simulator/simulator.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      //{ path: '', component: HomeComponent },
      { path: '', component: SimulationComponent }
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
