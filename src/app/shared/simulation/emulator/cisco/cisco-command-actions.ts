import { StateContainer } from './../emulator-state';
//import { selector } from 'rxjs/operator/multicast';

import { ICommandAction, CommandAction } from '../interfaces/command-action';
import { ICiscoDevice, ICiscoInterface } from './icisco-device';
import { CiscoFormatters } from './common/cisco-formatters';
import { CiscoUtils } from './common/cisco-utils';

export interface PortChannelActionModel { }
export interface ChannelGroupActionModel { }
export interface NoShutdownActionModel {
  // TODO: Model should contain strings to identify interfaces, NOT object references
  interfaces: ICiscoInterface[];
  //state: 'up' | 'down';
}

export interface ShutdownActionModel {
  // TODO: Model should contain strings to identify interfaces, NOT object references
  interfaces: ICiscoInterface[];
  //state: 'up' | 'down';
}

export enum CiscoAction {
  PortChannel,
  ChannelGroup,
  NoShutdown,
  Shutdown
}


export class CiscoCommandAction<T> implements CommandAction<T> {
  model: T;
  readonly do: (model: T) => string;
  actionId: CiscoAction;
}

export interface ICiscoCommandActions {
  portChannel(model: PortChannelActionModel): CiscoCommandAction<PortChannelActionModel>;
  channelGroup(model: ChannelGroupActionModel): CiscoCommandAction<ChannelGroupActionModel>;
  noShutdown(model: NoShutdownActionModel): CiscoCommandAction<NoShutdownActionModel>;
  shutdown(model: ShutdownActionModel): CiscoCommandAction<ShutdownActionModel>;
}

export class CiscoCommandActions implements ICiscoCommandActions {
  portChannel(model: PortChannelActionModel): CiscoCommandAction<PortChannelActionModel> {
    throw new Error("Method not implemented.");
  }
  channelGroup(model: ChannelGroupActionModel): CiscoCommandAction<ChannelGroupActionModel> {
    throw new Error("Method not implemented.");
  }
  noShutdown(model: NoShutdownActionModel): CiscoCommandAction<NoShutdownActionModel> {
    var self = this;
    return { actionId: CiscoAction.NoShutdown, model: model, do: (model) => self.doNoShutdown(model) };
  }
  shutdown(model: ShutdownActionModel): CiscoCommandAction<ShutdownActionModel> {
    var self = this;
    return { actionId: CiscoAction.Shutdown, model: model, do: (model) => self.doShutdown(model) };
  }

  constructor(public device: ICiscoDevice) { }

  private doCreatePortChannel(model: PortChannelActionModel) {
    // TODO: Implementation to create the port channel    
    throw new Error("Method not implemented.");
  }


  /**
   * TODO: Conditionally show output and verify as per protocol
   * @param model 
   */
  private doShutdown(model: ShutdownActionModel) {
    let output: string = '';
    for(let iface of model.interfaces) {
      let ciscoInterface = iface as ICiscoInterface;
      ciscoInterface.shutdown();
    }
    let time: number = Date.now(); //now
    for (let i = 0; i < model.interfaces.length; ++i) {
      let int: any = model.interfaces[i].model;
      let statusText = int.status;
      if (statusText === 'admin down') statusText = 'administratively down';
      output += `*${CiscoFormatters.formatDate(new Date(time))}: %LINEPROTO-5-UPDOWN: Line protocol on Interface ${int.$class}${int.slot}/${int.port}, changed state to ${statusText}
`;
      time += CiscoUtils.getRandom(200, 1000);
    }

    return output;
  }



/**
 * 
 * @param model 
 */
  private doNoShutdown(model: NoShutdownActionModel) {
    let output: string = '';
    for(let iface of model.interfaces) {
      let ciscoInterface = iface as ICiscoInterface;
      ciscoInterface.noShutdown();
    }
    let time: number = Date.now(); //now
    for (let i = 0; i < model.interfaces.length; ++i) {
      let int: any = model.interfaces[i].model;
      let statusText = int.status;
      if (statusText === 'admin down') statusText = 'administratively down';
      output += `*${CiscoFormatters.formatDate(new Date(time))}: %LINEPROTO-5-UPDOWN: Line protocol on Interface ${int.$class}${int.slot}/${int.port}, changed state to ${statusText}
`;
      time += CiscoUtils.getRandom(200, 1000);
    }

    return output;
  }


}