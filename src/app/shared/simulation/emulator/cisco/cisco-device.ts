import { IEmulatedTerminal } from '../interfaces/iemulated-terminal';
import { ICiscoDevice, ICiscoInterface } from './icisco-device';
import { CiscoTerminal } from './cisco-terminal';
import { CiscoInterface } from './cisco-interface';
import { EmulatorDeviceState } from '../emulator-state';
import { EmulatedDeviceBase } from '../emulated-device';
import { TerminalCommand } from '../interfaces/terminal-command';
import { CiscoTerminalContext, InterfaceSelector } from './cisco-terminal-command';
import { DeviceModel, InterfaceModel } from '../../simulation-model';
import { configureInterfaceCommands } from './commands/confinterface-commands';
import { configureTerminalCommands } from './commands/confterm-commands';
import { enabledCommands } from './commands/enabled-commands';
import { deviceCommands } from './commands/device-commands';
import { EventDispatcher } from 'event-dispatch';
import { Device, IDevice } from './model/device.model';
import { CiscoValidators } from './common/cisco-validators';
import { InterfaceInfo } from './common/cisco-interface-info';
import { IEmulatedInterface } from '../interfaces/iemulated-device';

export class CiscoDevice extends EmulatedDeviceBase {
    protected terminal: CiscoTerminal;
    private _interfaces: { [key: number]: ICiscoInterface } = {};

    private nullTerminal = null as any as IEmulatedTerminal;

    getDefaultTerminal(): IEmulatedTerminal {
        if (!this.isTerminalEnabled()) {
          return this.nullTerminal;
        }
        if (!this.terminal) {
            this.terminal = new CiscoTerminal(this);
            // TODO: this.state.setProperty(this.terminalStateName, this.terminal.terminalContext);
        }
        return this.terminal;
    }

    /**
     * Creates a terminal without a saved state, independent of the default terminal
     */
    createPrivateTerminal(): IEmulatedTerminal {
      if (!this.isTerminalEnabled()) {
        return this.nullTerminal;
      }
      return new CiscoTerminal(this);
    }

    isTerminalEnabled(): boolean {
        return !(this.property('noTerminal'));
    }

    getCommands(cmdContext: CiscoTerminalContext): TerminalCommand[] {
        if (cmdContext.confInterface) {
            return [
                ...configureInterfaceCommands
                // ...configureTerminalCommands,
                // ...enabledCommands
            ];
        }
        if (cmdContext.confTerminal) {
            return [
                ...configureTerminalCommands
                // ...enabledCommands
            ];
        }
        if (cmdContext.enabled) {
            return enabledCommands;
        }
        return deviceCommands;
    }

    createRange(range: string): string[] {
        if (typeof range === 'undefined') {
          return [];
        }
        // possible input values & outputs:
        // 0/0 => [ 0/0 ]
        // 0/0-1 => [ 0/0, 0/1 ]
        // 1 => 1
        // 1-3 => [ 1, 2, 3]
        // 1,3 => [ 1, 3]
        // 1-3,4-5,6

        let returnVal: string[] = [];
        if (0 < range.indexOf(',')) {
          const ranges = range.split(',');    // if it has a comma in it,
            for (const r of ranges) { // then return the ranges for each range.split
                returnVal = returnVal.concat(this.createRange(r));
            }
            return returnVal;
        }
        // Now I can be certain that I'm dealing with a single range
        if (0 < range.indexOf('/')) {
          const portRange = range.split('/');
            const port = portRange[0];
            const rangeList = this.createRange(portRange[1]); // let this handle 0-1
            for (const r of rangeList) {
                returnVal.push(port + '/' + r);
            }
            return returnVal;
        }
        // now I can be certain that have 0-3 or just 3
        if (0 < range.indexOf('-')) {

            const rangeList = range.split('-');
            let startRange = Number(rangeList[0]);
            const endRange = Number(rangeList[1]);
            if (endRange) {
                for (startRange; startRange <= endRange; startRange++) {
                    returnVal.push(startRange.toString());
                }
            }
            return returnVal;
        }
        // if I get here, it's just a single #
        return [range];
    }

    constructor(protected _model: DeviceModel) {
      super(_model);
    }

    getInterfaces(selector?: InterfaceSelector): ICiscoInterface[]|any {
      const nullInterfaces = null as any as ICiscoInterface[];
      if (selector) {
        const ciscoInterfaces: ICiscoInterface[] = [];
        if (typeof selector.range !== 'undefined') {  // because 0 is a valid range, but it is not truthy
          const rangeList: any[] = this.createRange(selector.range);
          for (const range of rangeList) {
            const name = selector.name + range;
            const item = this._model.interfaces.find((value) =>
              value.name.toLowerCase() === name.toLowerCase()
            );
            if (item) {
              ciscoInterfaces.push(this.getOrCreateInterface(item));
            } else { // the user asked for an invalid range,
              return nullInterfaces;
            }
          }

          if (selector.name.toLowerCase().startsWith('port-channel')) {
            // find all interfaces with the channel-group id of range
            const range = Number(selector.range);
            if (range > 0) {
              const interfaceName = selector.name + selector.range;
              for (const interfaceModel of this._model.interfaces) {
                if (interfaceModel.channelGroup && interfaceModel.channelGroup.id
                  && interfaceModel.channelGroup.id.toString() === range.toString()) {
                  ciscoInterfaces.push(this.getOrCreateInterface(interfaceModel));
                }
              }
              return ciscoInterfaces;
            } else  {
              // not a valid port channel
              return nullInterfaces;
            }
          }

          return ciscoInterfaces;
        } else { }
        // return the correct interfaces
        const item = this._model.interfaces.find((value) =>
          value.name.toLowerCase() === selector.name.toLowerCase()
        );

        if (item) {
          return [this.getOrCreateInterface(item)];
        }
        return nullInterfaces;
      } else {
        // return all interfaces
        return this._model.interfaces.map((value) => this.getOrCreateInterface(value));
      }
    }

    getInterface(selector: string): ICiscoInterface {
      const ifaceInfo = InterfaceInfo.validateInterfaceId(selector);
      const result = null as any as ICiscoInterface;

      // use the full name as the permanent index
      if (ifaceInfo.isValid) {
        const results = this.getInterfaces({ name: ifaceInfo.longName, range: ifaceInfo.numberToken });
        if (results.length > 1) {

        }
        return results[0];
      } else {
        // TODO: throw new Error('Invalid interface: '+selector);
      }
      return result;
    }

    private getOrCreateInterface(model: InterfaceModel): ICiscoInterface {
      if (!model.id) {
        console.log('Interface missing id: ' + JSON.stringify(model));
        // TODO: assign an Id

        // return a non-singleton instance
        return new CiscoInterface(model);
      }
      const id = model.id;
      let result = this._interfaces[id];
      if (!result) {
        result = new CiscoInterface(model);
        this._interfaces[id] = result;
      }
      return result;
    }
}
