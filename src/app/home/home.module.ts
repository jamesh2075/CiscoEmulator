import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NameListService } from '../shared/name-list/name-list.service';
//import { SimulationComponent, SimulatedDeviceComponent } from './simulation.component';
import { SimulatedDeviceComponent } from '../simulator/simulated-device.component';
import { SimulationComponent } from '../simulator/simulator.component';
import { Simulation } from '../shared/simulation/simulation';
import { StateService } from '../shared/state.service';

@NgModule({
  imports: [HomeRoutingModule, SharedModule],
  declarations: [HomeComponent, SimulationComponent, SimulatedDeviceComponent],
  exports: [HomeComponent, SimulationComponent, SimulatedDeviceComponent],
  providers: [NameListService, Simulation, StateService]
})
export class HomeModule { }
