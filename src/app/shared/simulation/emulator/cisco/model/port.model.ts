import { IInterface, Interface } from "./interface.model";
import { ISwitchport, Switchport } from "./switchport.model";
import { Type } from "class-transformer";

export interface IPort extends IInterface {
    type: string;
    switchportMode: string;
    switchport: ISwitchport;
    method: string;
    hardware: string;
}

export class Port extends Interface implements IPort {

    constructor() {
        super();
        this.id = Interface.CURRENT_ID++;
        this.takeSnapshot();
    }

    type: string = "Port"; // TODO: deprecate
    status: string = "down";
    protocol: string = "down";
    switchportMode = "Disabled";
    method = "unset";
    hardware = "";

    @Type(() => Switchport)
    switchport: Switchport = new Switchport();
}
