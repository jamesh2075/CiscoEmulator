export interface IStateReadOnly {
    property(selector: string | string[]): any;
}

export interface IState extends IStateReadOnly {
    setProperty(selector: string | string[], value: any): void;
    setProperties(props: { [name: string]: any }): void;
}

export class StateContainer implements IState {
    protected properties: { [key: string]: any };

    constructor(propertyRoot?: any) {
        if (propertyRoot) {
            this.properties = propertyRoot;
        } else {
            this.properties = [];
        }
    }

    property(selector: string | string[]): any {
        if (!Array.isArray(selector)) {
            selector = [selector];
        }

        let obj = this.findPropertyContainer(selector);

        // the name of the property we're getting is the last selector
        let property = selector[selector.length - 1];

        return obj[property];
    }

    setProperties(props: { [name: string]: any }) {
        // TODO: Convert to expression
        for (let propertyName in props) {
            let value = props[propertyName];
            this.setProperty(propertyName, value);
        }
    }

    setProperty(selector: string | string[], value: any) {
        if (!Array.isArray(selector)) {
            selector = [selector];
        }

        let obj = this.findPropertyContainer(selector);
        // the name of the property we're setting is the last selector
        let property = selector[selector.length - 1];

        if (value === null) {
            delete obj[property];
        } else {
            obj[property] = value;
        }
    }

    private findPropertyContainer(selector: string[]) {
        let obj = this.properties;
        for (let index = 0; index < selector.length - 1; index++) {
            let propName = selector[index];
            // create the property if it doesn't exist
            if (obj[propName]) {
                obj = obj[propName];
            } else if (!obj[propName]) {
                //what if obj is an array and has a child whose name is propName?
                let found = false;
                if (Array.isArray(obj)) {
                    for (let i = 0; i < obj.length; i++) {
                        if (obj[i].name === propName) {
                            obj = obj[i];
                            found = true;
                            break;
                        }
                    }
                }
                if (found === false) {
                    // if not, then default behavior:
                    obj[propName] = {};
                    obj = obj[propName];
                }
            }
        }
        return obj;
    }

}

export class EmulatorDeviceState extends StateContainer {
    setProperty(selector: string | string[], value: any) {
        if (!Array.isArray(selector)) {
            selector = [selector];
        }
        switch (selector[0].toLowerCase()) {
            // Ignore these properties
            //case 'interfaces': //KB: I'm un ignoring this property

            case 'commands':
                break;
            default: {
                super.setProperty(selector, value);
                break;
            }
        }
    }
}
