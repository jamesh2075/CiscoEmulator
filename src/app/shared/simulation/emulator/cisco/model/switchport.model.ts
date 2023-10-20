// http://www.cisco.com/c/en/us/support/docs/switches/catalyst-6000-series-switches/10599-88.html
import { ISerialize } from './interfaces/serialize.interface';
import { BaseModel } from './base.model';
import { Type } from 'class-transformer';

export interface ISwitchportPrivateVlan {
    host: string;
    mapping: string;
    privatetrunkVlan: (number | string);
    trunkVlanTag: string;
    trunkEncapsulation: string;
}

// http://www.cisco.com/c/en/us/support/docs/switches/catalyst-6000-series-switches/10599-88.html
export interface ISwitchport {
    adminMode: string;
    opMode: string;
    adminTrunkEncapsulation: string;
    opTrunkEncapsulation: string;
    trunkNegotiation: string;
    accessVlan: number;
    trunkVlan: number;
    adminVlanTag: string;
    voiceVlan: string;
    adminPrivateVlan: ISwitchportPrivateVlan;
    opPrivateVlan: string;
    trunkingVlans: string;
}

export const SwitchportStatus = {
    ENABLED: 'Enabled',
    DISABLED: 'Disabled'
};

export class SwitchportPrivateVlan extends BaseModel implements ISwitchportPrivateVlan {
    host = 'none';
    mapping = 'none';
    privatetrunkVlan = 'none';
    trunkVlanTag = 'enabled';
    trunkEncapsulation = 'negotiate';
}

export class Switchport extends BaseModel implements ISwitchport {

    adminMode = 'dynamic auto';
    opMode = 'static access';
    adminTrunkEncapsulation = 'negotiate';
    opTrunkEncapsulation = 'native';
    trunkNegotiation = 'On';
    accessVlan = 1;
    trunkVlan = 1;
    adminVlanTag = 'enabled';
    voiceVlan = 'none';

    @Type(() => SwitchportPrivateVlan)
    adminPrivateVlan = new SwitchportPrivateVlan();
    opPrivateVlan = 'none';
    trunkingVlans = 'ALL';

    constructor() {
        super();
        this.takeSnapshot();
    }
}
