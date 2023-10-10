import {BaseModel} from "./base.model";

export interface IInterface {
    id: number;
    name: string;
    status: string;
    interface: string;
    description: string;

    serialize?: any;
}

export abstract class Interface extends BaseModel implements IInterface {

    protected static CURRENT_ID = 0;
    _name: string = "";

    id: number = 0;
    set name(val:string){
        this._name = val;
    }
    get name(): string {
        return this._name;
    }

    get interface(): string {
        return ""
    }

    status = "";
    description = "";
}
