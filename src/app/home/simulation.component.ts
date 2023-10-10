import { Component, OnInit, Input, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { SimulationFactory } from '../shared/simulation/index';
import { Simulation } from '../shared/simulation/simulation';
import { IEmulatedDevice } from '../shared/simulation/emulator/interfaces/iemulated-device';
import { SimICND2 } from '../shared/simulation/exam/icnd2';

@Component({
  moduleId: module.id,
  selector: 'sd-simulation',
  template: `
<div>
  <div *ngFor="let device of simulation.devices">
    <sd-simulated-device *ngIf="(device.isTerminalEnabled())" [device]="device"></sd-simulated-device>
  </div>
</div>
  `
})
export class SimulationComponent implements OnInit {
  public command: string;
  public commandOutput: string;

  @Input()
  public simulation: Simulation;

  ngOnInit(): void {
    // TODO: vvv Remove testing code below vvv
    if (!this.simulation) {
      this.simulation = this.testonly_getDefaultSimulation();
    }
    // TODO: ^^^ Remove testing code above ^^^
  }

  // TODO: vvv Remove testing code below vvv
  private testonly_getDefaultSimulation(): Simulation {
    // return SimulationFactory.load(sim8);
    return SimulationFactory.load(SimICND2);
  }
  // TODO: ^^^ Remove testing code above ^^^

}



@Component({
  moduleId: module.id,
  selector: 'sd-simulated-device',
  styles: [`
.console-output {
  width: 700px;
}
  `],
  template: `
<h3>{{prompt}}</h3>

<textarea #autoScroll rows="20" class="console-output" readonly>{{commandOutput}}</textarea>
<form (submit)="submitCommand()" autocomplete="off">
  <input [(ngModel)]="command" name="command" placeholder="Enter a console command"
     (keydown)="onKey($event)" class="console-output">
  <!--<button type="submit">Submit</button>
  <button type="button" (click)="completeCommand()">Autocomplete</button>-->
</form>

  `
})
export class SimulatedDeviceComponent implements OnInit {
  public command: string;
  public commandOutput: string = '';
  private static KEYCODE_QUESTION: number = 191;
  private static KEYCODE_TAB: number = 9;
  private static KEYCODE_ENTER: number = 13;
  @ViewChild('autoScroll') private scrollTextArea: ElementRef;

  @Input()
  public device: IEmulatedDevice;

  get prompt(): string {
    return this.device.getDefaultTerminal().getPrompt();
  }

  onKey(e: any) {
    let result = true;  //default
    switch (e.keyCode) {
      case SimulatedDeviceComponent.KEYCODE_ENTER:
        this.invokeCommand();
        result = false;
        break;
      case SimulatedDeviceComponent.KEYCODE_TAB:
        this.completeCommand();
        result = false;
        break;
      case SimulatedDeviceComponent.KEYCODE_QUESTION:
        if (e.shiftKey) {
          this.queryCommand();
        }
        break;
      default: break; //do nothing
    }
    return result;
  }

  invokeCommand() {
    let terminalHandler = this.device.getDefaultTerminal();
    if (terminalHandler) {
      this.addOutput(`${this.prompt} ${this.command}`);
      let result = terminalHandler.invoke(this.command);

      this.addOutput(result.output);
      this.command = '';
    } else {
      this.addOutput('Unable to obtain console interface');
    }
  }
  queryCommand() {
    let terminalHandler = this.device.getDefaultTerminal();
    if (terminalHandler) {
      let result = terminalHandler.query(this.command);
      this.addOutput(result.output);
    } else {
      this.addOutput('Unable to obtain console interface');
    }
  }

  completeCommand() {
    let terminalHandler = this.device.getDefaultTerminal();
    if (terminalHandler) {
      let result = terminalHandler.complete(this.command);
      this.addOutput(result.output);
    } else {
      this.addOutput('Unable to obtain console interface');
    }
  }

  submitCommand() {
    let terminalHandler = this.device.getDefaultTerminal();
    if (terminalHandler) {
      if (this.command.endsWith('?')) {
        let result = terminalHandler.query(this.command);
        this.addOutput(result.output);
      } else {
        let result = terminalHandler.invoke(this.command);
        this.addOutput(result.output);
      }
    } else {
      this.addOutput('Unable to obtain console interface');
    }
  }
  addOutput(output: string, command: string = '') {
    if (output && output !== '') {
      this.commandOutput = `${this.commandOutput}\n${output}`;
      this.scrollToBottom();
    }
  }
  scrollToBottom(): void {
    try {
      this.scrollTextArea.nativeElement.scrollTop = this.scrollTextArea.nativeElement.scrollHeight;
    } catch (err) { }
  }
  ngOnInit(): void {
    return;
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }



}
