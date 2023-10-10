import {plainToClass, Type} from "class-transformer";
import {GigabitEthernet} from './gigabitethernet.model';
import {IInterface, Interface} from './interface.model';
import {ISpanningTree, SpanningTree} from './spanning-tree.model';
import {IVlan, Vlan} from './vlan.model';
import {BaseModel} from "./base.model";
import {Port} from "./port.model";
import {Loopback} from "./loopback.model";
import {Ethernet} from "./ethernet.model";

export interface IVtp {
    domain: string;
    mode: string;
}

export interface IVlanPolicy { // TODO: ???
    internal: {
        allocation: {
            policy: string
        }
    }
}

export interface IDevice {
    name: string;
    type: string; // corresponds to "type" in VIRL
    subtype: string;
    address: string,
    ipv4: string;
    spanningtree: ISpanningTree;
    interfaces: IInterface[];//Array<IGigabitEthernet | ILoopback | IPort>[];
    noTerminal?: boolean; // true if this device does not support a terminal
    vlan: IVlanPolicy;
    vlans: IVlan[];
    vtp: IVtp; // VLAN Trunk Protocol http://www.cisco.com/c/en/us/support/docs/lan-switching/vtp/10558-21.html
    vtpConfig?: string; //determines the interface where is set the ip address for 'Local updater ID' in 'show vtp status'
}

export class Device extends BaseModel implements IDevice {

    name: string = "";
    type: string = "SIMPLE";
    subtype: string = "";
    address: string = "";

    ipv4: string = "";

    @Type(() => SpanningTree)
    spanningtree = new SpanningTree();

    private _interfaces: Interface[] = [];
    set interfaces(val: any[]) {
        if (val instanceof Array) {
            for (let i = 0; i < val.length; i++) {
                switch (val[i].$class) {
                    case "GigabitEthernet":
                        val[i] = plainToClass(GigabitEthernet, val[i]);
                        break;
                    case "Port":
                        val[i] = plainToClass(Port, val[i]);
                        break;
                    case "Loopback":
                        val[i] = plainToClass(Loopback, val[i]);
                        break;
                    case "Ethernet":
                        val[i] = plainToClass(Ethernet, val[i]);
                        break;
                    default:
                        console.warn('Unrecognized interface class', GigabitEthernet.name, val[i]);
                        throw new Error('Unrecognized interface class');
                }
            }
        }
        this._interfaces = val;
    }

    get interfaces(): any[] {
        return this._interfaces;
    }

    vtpConfig: string = "";
    vtp: IVtp = {
        domain: "",
        mode: ""
    };

    vlan: IVlanPolicy = {
        internal: {
            allocation: {
                policy: ""
            }
        }
    };

    @Type(() => Vlan)
    vlans: Vlan[] = [];

    noTerminal: boolean = false; // true if this device does not support a terminal

    constructor() {
        super();
        this.takeSnapshot();
    }

    findGigabitEthernet(name: string): GigabitEthernet {
        for (let inf of this.interfaces) {
            if (inf instanceof GigabitEthernet && inf['interface'] === name || inf.name === name) {
                return inf;
            }
        }
        return null;
    }

    addInterface(interf: Interface) {
        this.interfaces.push(interf);
    }

    removeInterface(target: Interface) {
        for (let index = 0; index < this.interfaces.length; index++) {
            let item = this.interfaces[index];
            if (item.id === target.id) {
                this.interfaces.splice(index, 1);
                break;
            }
        }
    }
}
