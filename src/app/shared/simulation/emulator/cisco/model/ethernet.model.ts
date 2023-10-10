import {IInterface, Interface} from "./interface.model";

export interface IEthernet extends IInterface {
}

export class Ethernet extends Interface implements IEthernet {

    private _name = "";
    set name(val:string) {
        this._name = val;
    }
    get name():string {
        return this._name ||  "eth" + this.id
    }

    constructor() {
        super();
        this.id = Interface.CURRENT_ID++;
        this.takeSnapshot();
    }

}
