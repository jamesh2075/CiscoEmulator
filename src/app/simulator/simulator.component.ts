import { Component, OnInit, Input, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { SimulationFactory } from '../shared/simulation/index';
import { Simulation } from '../shared/simulation/simulation';
import { SimICND2 } from '../shared/simulation/exam/icnd2';
import { SimulatedDeviceComponent } from './simulated-device.component';

@Component({
    moduleId: module.id,
    selector: 'sd-simulation',
    templateUrl: './simulator.component.html'
  })
export class SimulationComponent implements OnInit {
    public command: string;
    public commandOutput: string;
  
    @Input()
    public simulation: Simulation;
    //private static _simulation: Simulation;

    constructor(simulation: Simulation) {
      this.simulation = simulation;
    }

    ngOnInit(): void {

      // TODO: vvv Remove testing code below vvv
      //if (!this.simulation) {
      //  this.simulation = this.testonly_getDefaultSimulation();
      //}
      // TODO: ^^^ Remove testing code above ^^^
    }

    ngOnDestroy() : void {
    }
  
    // TODO: vvv Remove testing code below vvv
    //private testonly_getDefaultSimulation(): Simulation {
      // return SimulationFactory.load(sim8);
      //if (!SimulationComponent._simulation)
      //{
      //  SimulationComponent._simulation = SimulationFactory.load(SimICND2);
      //}
      //return SimulationComponent._simulation;
    //}
    // TODO: ^^^ Remove testing code above ^^^
  
  }