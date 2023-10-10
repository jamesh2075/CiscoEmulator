
import { CiscoDevice } from "./cisco-device";
import { InterfaceModel } from "../../simulation-model";

export class CiscoConnection {

    //the data that I need:
    // target device
    // the interface name/id on the target device
    private interfaceName: string;

    constructor(private target: CiscoDevice, private interfaceId: number) {
        let interfaces: InterfaceModel[] = target.model.interfaces.filter((t) => t.id === interfaceId);
        if (interfaces && interfaces.length === 1)
            this.interfaceName = interfaces[0].name;
    }

    dispatchEvent(event: String): void { }

    property(selector: string | string[]): any {
        if (!Array.isArray(selector)) selector = [selector];
        selector.unshift('interfaces', this.interfaceName);
        return this.target.property(selector);
    }

}
