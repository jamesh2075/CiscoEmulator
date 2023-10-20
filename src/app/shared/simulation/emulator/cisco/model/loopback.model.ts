import {IInterface, Interface} from "./interface.model";

export interface ILoopback extends IInterface {
    name: string;
    status: string;
    protocol: string;
    method ?: string;
    hardware ?: string;
}

export class Loopback extends Interface implements ILoopback {

    //private _name:string = "";

    description: "Loopback";
    status = "up";
    protocol = "up";
    switchportMode = "Disabled";
    method = 'unset';
    hardware = "Loopback";

    set name(val: string) {
        //this.switchportMode ?: string;        
        this._name = val;
    }
    get name(): string {
        return this._name;
    }

    constructor() {
        super();
        this.id = Interface.CURRENT_ID++;
        this.takeSnapshot();
    }
}
