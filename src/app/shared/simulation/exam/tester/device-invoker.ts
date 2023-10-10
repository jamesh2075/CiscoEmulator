import { IEmulatedDevice } from "../../emulator/interfaces/iemulated-device";
import { IEmulatedTerminal, CommandResult, CommandResultCode } from '../../emulator/interfaces/iemulated-terminal';
import { AsArray, AsSingle } from '../../emulator/util';


export interface InterfaceSelector {
  single?: string; // a single interface to be selected
  range?: string; // a range of interfaces to be selected
}

//export interface DeviceCommand {
//  id: number; // for result tracking
//  commandLine: string;
//}

export interface DeviceInvokeResult {
  interfaces: InterfaceSelector;
  //command: DeviceCommand;
  commandLine: string;
  resultCode?: CommandResultCode;
  output?: string;
}


export class DeviceInvoker {
  private terminal: IEmulatedTerminal;
  private ifaceSelector: InterfaceSelector;

  public invoke(interfaces: string | string[], commands: string[]): DeviceInvokeResult[] {
    // to issue the commands for all interfaces, multiple passes may be necessary
    let selectors = this.getInterfaceSelectors(interfaces);

    let results: DeviceInvokeResult[] = [];
    for (let selector of selectors) {
      let result = this.invokeForInterface(selector, commands);
      results = [...results, ...result];
    }
    return results;
  }

  constructor(private device: IEmulatedDevice) {
  }

  private invokeForInterface(selector: InterfaceSelector, commands: string[]): DeviceInvokeResult[] {
    let terminal = this.getTerminal(selector);

    let results: DeviceInvokeResult[] = [];
    for (let command of commands) {
      let invokeResult: DeviceInvokeResult = { interfaces: selector, commandLine: command };
      try {
        let cmdResult = terminal.invoke(command);
        invokeResult.resultCode = cmdResult.resultCode;
        invokeResult.output = cmdResult.output;
      } catch (e) {
        console.log(`${command} threw an exception`);
        console.log((<Error>e).message);
      }
      results.push(invokeResult);
    }
    return results;
  }

  private getTerminal(selector: InterfaceSelector): IEmulatedTerminal {
    if (this.terminal) {
      // if we already have a terminal, we can re-use it if the selector is the same
      if (this.ifaceSelector && JSON.stringify(this.ifaceSelector) !== JSON.stringify(selector)) {
        this.terminal = null; // discard this terminal reference so a new one will be created
        this.ifaceSelector = null;
      }
    }

    if (!this.terminal) {
      this.terminal = this.device.createPrivateTerminal();
    }

    // get the terminal to the required config state
    let isEnabled = false; // TODO: get from terminal context
    let isConfTerm = false; // TODO: get from terminal context
    let cmdResult: CommandResult;
    if (!isEnabled) {
      cmdResult = this.terminal.invoke('enable');
    }
    if (!isConfTerm) {
      cmdResult = this.terminal.invoke('configure terminal');
    }

    if (selector.range) {
      cmdResult = this.terminal.invoke('interface range ' + selector.range);
    } else if (selector.single) {
      cmdResult = this.terminal.invoke('interface ' + selector.single);
    } else {
      // no interface selection
    }
    this.ifaceSelector = selector;

    return this.terminal;
  }

  /**
   * Converts an array of interfaces to one or more selectors, each representing a single
   * interface or an interface range
   * @param interfaces 
   * 
   * Examples: 
   *  interfaces: ['gi1/0', 'gi1/1', 'gi1/2'] => [{ range: 'gi1/0-2' }]
   *  interfaces: ['gi1/0', 'gi2/1', 'gi1/3'] => [
   *    { single: 'gi1/0' },
   *    { single: 'gi2/1' },
   *    { single: 'gi1/3' }]
   */
  private getInterfaceSelectors(interfaces: string | string[]): InterfaceSelector[] {
    // try to use interface range if we can
    if (this.canUseInterfaceRange(interfaces)) {
      return [{ range: this.toInterfaceRange(interfaces) }];
    }

    return AsArray(interfaces).map((value: string): InterfaceSelector => { return { single: value }});
  }

  private toInterfaceRange(interfaces: string | string[]): string {
    return AsSingle(interfaces);
  }

  private canUseInterfaceRange(interfaces: string | string[]): boolean {
    // TODO: Determine if all of the interfaces can be selected with a single range command
    return false;
  }
}

