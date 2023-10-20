import { BaseModel } from './base.model';
import { Type } from 'class-transformer';
import { IVlan } from './vlan.model';


export interface IPortFastDefault {
    default: boolean;
}

export interface IPortFastEdge {
    bpdufilter: IPortFastDefault;
    bpduguard: IPortFastDefault;
    default: boolean;
}

export interface IPortFast {
    edge: IPortFastEdge;
    network: IPortFastDefault;
    normal: IPortFastDefault;
}

export interface ISpanningTree {
    mode: string;
    defaultPriority: number;
    portfast: IPortFast;
    vlan: IVlan;
}

export class PortFastDefault extends BaseModel implements IPortFastDefault {
    default = false;
}

export class PortFastEdge extends BaseModel implements IPortFastEdge {

    @Type(() => PortFastDefault)
    bpdufilter = new PortFastDefault();

    @Type(() => PortFastDefault)
    bpduguard = new PortFastDefault();

    default = false;

}

export class PortFast extends BaseModel implements IPortFast {

    @Type(() => PortFastEdge)
    edge = new PortFastEdge();

    @Type(() => PortFastDefault)
    network = new PortFastDefault();

    @Type(() => PortFastDefault)
    normal = new PortFastDefault();
}

export class SpanningTree extends BaseModel implements ISpanningTree {

    mode = 'pvst';
    defaultPriority = 32768;
    @Type(() => PortFast)
    portfast = new PortFast();
    vlan: IVlan;
    
    constructor() {
        super();
        this.takeSnapshot();
    }
    
}
