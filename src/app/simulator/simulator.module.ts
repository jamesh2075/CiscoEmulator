import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationComponent } from './simulator.component';
import { SimulatedDeviceComponent } from './simulated-device.component';
import { Simulation } from '../shared/simulation/simulation';

@NgModule({
  imports: [CommonModule],
  declarations: [SimulationComponent, SimulatedDeviceComponent],
  providers: [Simulation],
  exports: [SimulationComponent, SimulatedDeviceComponent]
})
export class SimulatorModule { }