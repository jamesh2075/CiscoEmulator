import { ParsedCommand, ParsedCommands, ParseCommandResult } from '../interfaces/parsed-command';
import { CiscoDevice } from '../cisco/cisco-device';
import { DeviceModel } from '../../simulation-model';
import { ICommandAction } from './command-action';

export interface PropertyChange {
  selector: string[];
  value: any;
}

export class CommandState {
  command: ParsedCommand;

  properties: { [name: string]: any } = [];

  parameters: { [name: string]: any } = [];

  token: string;
  changes: PropertyChange[] = [];
  contextChanges: PropertyChange[] = [];
  actions: ICommandAction[] = [];
  events: { name: string, data?: any }[] = [];
  output: string = '';
  // TODO: action: ():string;
  stopProcessing: boolean = false;

  constructor() {
  }

  ChangeProperty(selector: string | string[], value: any) {
    if (!Array.isArray(selector)) {
      selector = [selector];
    }
    this.changes.push({ selector: selector, value: value });
  }

  ChangeContextProperty(selector: string | string[], value: any) {
    if (!Array.isArray(selector)) {
      selector = [selector];
    }
    this.contextChanges.push({ selector: selector, value: value });
  }

  DispatchEvent(name: string, data?: any) {
    this.events.push({
      name: name,
      data: data
    });
  }

  addAction(action: ICommandAction) {
    this.actions.push(action);
  }

}
