import { Type } from "class-transformer";
import { Device } from "./device.model";
import { BaseModel } from "./base.model";

export interface IConnection {
  srcDevice: string;
  srcIface: string;
  destDevice: string;
  destIface: string;
}

export interface IConnectionEndpoint {
  device: string;
  iface: string;
}

export class Connection extends BaseModel implements IConnection {
  srcDevice: string = null;
  srcIface: string = null;
  destDevice: string = null;
  destIface: string = null;

  constructor(src?: IConnectionEndpoint, dest?: IConnectionEndpoint) {
    super();
    this.takeSnapshot();
    if (src) {
      this.srcDevice = src.device;
      this.srcIface = src.iface;
    }
    if (dest) {
      this.destDevice = dest.device;
      this.destIface = dest.iface;
    }
  }

}
