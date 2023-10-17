import { IEmulatedDevice, IEmulatedInterface, IInterfaceConnection, IPeerConnection } from './emulator/interfaces/iemulated-device';
import { StateContainer } from './emulator/emulator-state';
import { EmulatedDevice } from './emulator/emulated-device';
import { SimulationModel, DeviceModel, InterfaceModel } from './simulation-model';
import { IConnection, Connection } from './emulator/cisco/model/connection.model';
import { CiscoDevice } from './emulator/cisco/cisco-device';
import { CISCO_CONTROLLERS } from './emulator/cisco/controllers/controllers.module';
import { SimDefinition } from './sim-definition';
import { Topology } from './emulator/cisco/model/topology.model';
import { plainToClass } from 'class-transformer';
import { Injectable } from '@angular/core';
import { SimICND2 } from './exam/icnd2';

export interface ISimulation {
  devices: IEmulatedDevice[];
}

@Injectable()
export class Simulation implements ISimulation {
    private __state: StateContainer;
    private connections: SimConnection[] = [];
    private topology:Topology = new Topology();

  public devices: IEmulatedDevice[] = [];

  private model: SimulationModel|any = null;

    getModel():Topology {
        return this.topology;
    }

  property(name: string): any {
    return this.__state.property(name);
  }

  public constructor() {
    this.setupModel(SimICND2);
}

  getDevice(name: string): IEmulatedDevice {
    // TODO: Convert to expression
    const searchName = name.toLowerCase();
    for (const device of this.devices) {
      if (searchName === device.name.toLowerCase()) {
        return device;
      }
    }
    const nullDevice:any = null;
    return nullDevice;
  }

  // commands (replay subject)

  // queryCommand(command: string)

  // invokeCommand(command: string)

  // state

  setupModel(data: SimDefinition) {
    this.topology = plainToClass(Topology, data) as Topology;

    const model = new SimulationModel();

    for (const device of this.topology.devices) {
      model.devices[device.name] = device as DeviceModel;
    }

    this.model = model;

    this.__state = new StateContainer(model);

    // create the devices
    for (const device in model.devices) {
      this.devices.push(new CiscoDevice(model.devices[device]));
    }

    // establish connections
    for (const connection of this.topology.connections) {
      this.connect(connection);
    }

    for (const ControllerClass of CISCO_CONTROLLERS) {
      ControllerClass['init']();
    }
  }

  private connect(connection: IConnection): SimConnection {
    const srcDevice = this.getDevice(connection.srcDevice);
    const destDevice = this.getDevice(connection.destDevice);

    const result = new SimConnection(srcDevice.getInterface(connection.srcIface), destDevice.getInterface(connection.destIface));
    this.connections.push(result);
    return result;
  }

  private createDevice(model: DeviceModel): IEmulatedDevice {
    const subtype = model.subtype.toLowerCase();
    if (subtype === 'iosvl2') {
      return new CiscoDevice(model);
    }
    if (subtype === 'iosv') {
      return new CiscoDevice(model);
    }
    if (subtype === 'lxc') {
      return new EmulatedDevice(model);
    }

    console.log('unknown device subtype: ' + model.subtype);
    return new EmulatedDevice(model);
  }
}


class InterfaceConnection implements IInterfaceConnection, IPeerConnection {
  iface: IEmulatedInterface;
  peer: IPeerConnection;

  get status(): string {
    if (this.iface.model.status == undefined) {
      return '';
    }
    else {
      return this.iface.model.status;
    }
  }
  get protocol(): string {
    return (<any>this.iface.model).protocol;
  }
  get channelGroupProtocol(): string {
    return this.iface.property(['channelGroup', 'protocol']);
  }
  get channelGroupMode(): string {
    return this.iface.property(['channelGroup', 'groupMode']);
  }
  get switchportMode(): string {
    return this.iface.property(['switchport', 'mode']);
  }
  get switchportAccessVlan(): string {
    return this.iface.property(['switchport', 'accessVlan']);
  }
  get switchportTrunkVlan(): string {
    return this.iface.property(['switchport', 'trunkVlan']);
  }
  onPeerStatusChanged(peerStatus: string): void {
    if(this.iface) {
      this.iface.onPeerStatusChanged(peerStatus);
    } else {
      throw new Error(`Connection's interface is not defined`);
    }
  }

  constructor() {
  }

  setConnection(iface: IEmulatedInterface, peer: IPeerConnection) {
    this.peer = peer;
    this.iface = iface;

    // Associate the interface with this connection
    iface.connection = this;
  }
}

class SimConnection {
  srcConnection: IInterfaceConnection;
  destConnection: IInterfaceConnection;

  constructor(src: IEmulatedInterface, dest: IEmulatedInterface) {
    // create the connection object that each interface will use for communication
    const srcConn = new InterfaceConnection();
    const destConn = new InterfaceConnection();
    srcConn.setConnection(src, destConn);
    destConn.setConnection(dest, srcConn);
    this.srcConnection = srcConn;
    this.destConnection = destConn;
  }
}
