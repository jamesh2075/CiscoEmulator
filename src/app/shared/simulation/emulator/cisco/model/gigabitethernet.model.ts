import { IInterface, Interface } from './interface.model';
import { ISwitchport, Switchport } from './switchport.model';
import { Type } from 'class-transformer';
import { toJSONObject } from './utils/formatters';

export interface IChannelGroup {
    id: number;
    mode: string; // 'active', 'suspended', ...
    protocol: string;
}

export interface IGigabitEthernet extends IInterface {
    type: string;
    role: string;
    portState: string;
    cost: number;
    priorNo: number;
    $class: string;
    address: string;
    hardware: string;
    internetAddress: string;
    etherflag: string;
    slot: number;
    port: number;   //Is Port-Channel
    channelGroup: IChannelGroup; // TODO: ChannelGroups should use this
    ChannelGroup: number;
    description: string;
    ipv4: string;
    ipv4Mask: string;
    protocol: ('up' | 'down');
    duplex: string;
    vlan: (number | string);
    speed: string;
    portType: string;
    stat: string;
    switchportMode: string; // 'Enabled', 'Disabled'
    switchport: ISwitchport;
    trunkEnabled: boolean;
    method?: string;
    subnet?: string;

    // includes:any; // TODO: Why is this needed?
}

const ChannelGroupMode = {
    ACTIVE: 'active',
    SUSPENDED: 'suspended'
};

export class ChannelGroup implements IChannelGroup {
    id = 0;
    mode = '';
    protocol = '';
}

export class GigabitEthernet extends Interface implements IGigabitEthernet {

    set name(val: string) {
        // does nothing but is required by IInterface
    }
    get name(): string {
        return `GigabitEthernet${this.slot}/${this.port}`;
    }

    get shortName(): string {
        return `Gi${this.slot}/${this.port}`;
    }

    get interface(): string {
        return `Gi${this.slot}/${this.port}`;
    }

    type = 'Shr';
    slot = 0;
    port = 0;
    description = '';

    role = 'Desg';
    status: ('up' | 'down' | 'admin down') = 'up';
    portState = 'FWD';
    cost = 4;
    priorNo = 0;
    address = '';
    hardware = '';
    internetAddress = '';
    protocol: ('up' | 'down') = 'up';
    duplex = '';
    speed = '';
    portType = 'unknown';
    stat = 'connected';
    switchportMode = 'Enabled';
    trunkEnabled = false;
    etherflag = '';
    ipv4 = '';
    ipv4Mask = '';
    method = 'unset';
    subnet = '';
    autoNegotiation = 'true';
    cdpEnabled = 'true';

    channelGroup: ChannelGroup = new ChannelGroup(); // TODO: This is how it should be used
    ChannelGroup = 0;
    // vlan = new Vlan(); // TODO: Fix this
    vlan = 0;

    @Type(() => Switchport)
    switchport: Switchport = new Switchport();

    constructor() {
        super();
        this.id = Interface.CURRENT_ID++;
        this.takeSnapshot();
    }
}