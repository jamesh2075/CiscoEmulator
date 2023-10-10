import { Component, OnInit, Input, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { IEmulatedDevice } from '../shared/simulation/emulator/interfaces/iemulated-device';
import { StateService } from '../shared/state.service';

@Component({
    moduleId: module.id,
    selector: 'sd-simulated-device',
    styleUrls: ['./simulated-device.component.css'],
    templateUrl: './simulated-device.component.html'
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

    private state: StateService;
    constructor(stateService: StateService) {
      this.state = stateService;
    }

    ngOnInit(): void {
      let output:string = this.state.properties.get(this.device.name) as string;
      if (output)
        this.commandOutput = output;
    }
    ngOnDestroy(): void {
      this.state.properties.set(this.device.name, this.commandOutput)
    }
  
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
        let newLine = '';
        if (this.commandOutput != '')
          newLine = '\n';
        this.commandOutput = `${this.commandOutput}${newLine}${output}`;
        this.scrollToBottom();
      }
    }
    scrollToBottom(): void {
      try {
        this.scrollTextArea.nativeElement.scrollTop = this.scrollTextArea.nativeElement.scrollHeight;
      } catch (err) { }
    }
    
    ngAfterViewChecked() {
      this.scrollToBottom();
    }
  
  
  
  }