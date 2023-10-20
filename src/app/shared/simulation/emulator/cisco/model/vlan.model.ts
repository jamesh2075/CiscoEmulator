import {CiscoFormatters} from '../common/cisco-formatters';
import {BaseModel} from './base.model';
import {CommandConstants} from '../common/cisco-constants';

export interface IVlan {
    id: number;
    name: string;
    type: string;
    status: string;
    ipAddress: string;
    defaultMode: string;
    priority: number;
    spanningEnabled?: boolean;
    trunkingEnabled?: boolean;
    SAID: string;
    MTU: string;
    Parent: string;
    RingNo: any; // TODO: type :number
    BridgeNo: any; // TODO: type :number
    Stp: string;
    BrdgMode: string;
    Trans1: string;
    Trans2: string;
    ports: string[];
    ifPorts: string[];
}

export class Vlan extends BaseModel implements IVlan {

    type = 'enet';
    status = 'active';
    ipAddress = '';
    defaultMode = '';
    priority = 32768;
    ports: string[] = [];
    ifPorts: string[] = [];
    spanningEnabled = false;
    trunkingEnabled = false;
    SAID = '';
    MTU = '';
    Parent = ''; // TODO: THIS SHOULD NOT BE '-'
    RingNo: any = 0;
    BridgeNo: any = 0;
    Stp = '';
    BrdgMode = '';
    Trans1 = '0'; // TODO: Should this be a string or number???
    Trans2 = '0'; // TODO: Should this be a string or number???

    protected _id = 0;
    get id() {
        return this._id;
    }

    set id(val: number) {
        this._id = val;
        if (!this.name) {
            this.name = 'VLAN' + CiscoFormatters.padLeft(val.toString(), '0000');
        }
    }

    protected _name = '';
    get name() {
        return this._name;
    }

    set name(val: string) {
        this._name = val;
    }

    constructor() {
        super();
        this.takeSnapshot();
    }


    static getInvalidVlanIds(vlans: IVlan[], vlanIds: number[]) {
        let invaliVlanIds: number[] = [];
        let currentVlanIds: number[] = [];
        for (let vlan of vlans) {
            currentVlanIds.push(vlan.id);
        }
        for (let vlanId of vlanIds) {
            if (currentVlanIds.indexOf(vlanId) === -1) {
                invaliVlanIds.push(vlanId);
            }
        }
        return invaliVlanIds;
    }

    static getValidVlanIds(vlans: IVlan[], vlanIds: number[]) {
        const validVlanIds: number[] = [];
        const currentVlanIds: number[] = [];
        for (let vlan of vlans) {
            currentVlanIds.push(vlan.id);
        }
        for (const vlanId of vlanIds) {
            if (currentVlanIds.indexOf(vlanId) !== -1) {
                validVlanIds.push(vlanId);
            }
        }
        return validVlanIds;
    }

    static hasVlan(vlans: IVlan[], vlanId: number) {
        for (const vlan of vlans) {
            if (vlan.id === vlanId) {
                return true;
            }
        }
        return false;
    }

    static getVlan(vlans: IVlan[], vlanId: number): IVlan {
        for (const vlan of vlans) {
            if (vlan.id === vlanId) {
                return vlan;
            }
        }
        return null;
    }

    static addVlans(vlans: IVlan[], vlanIds: number[]) {
        for (const vlanId of vlanIds) {
            if (!Vlan.hasVlan(vlans, vlanId)) {
                const newVlan = new Vlan();
                newVlan.id = vlanId;
                vlans.push(newVlan);
            }
        }
    }

    static getTrunkingVlans(vlans: IVlan[], allowedVlans: any[]) {
        let result: any;

        result = `${CommandConstants.VLAN.min}-`;
        for (const vlan of allowedVlans) {
            result += `${vlan - 1},${vlan + 1}-`;
        }
        result += `${CommandConstants.VLAN.max}`;

        return result;
    }
}
