import { CiscoUtils } from "./cisco-utils";
import { CiscoValidators } from "./cisco-validators";
import { CommandConstants } from "./cisco-constants";



export interface IInterfaceInfo {
    isValid: boolean,
    type: string,
    shortName: string,
    longName: string,
    fullName: string,
    inputToken: string,
    inputTokenName: string,
    inputTokenNumber: string,
    slot: number,
    isRange: boolean,
    port: number,
    startPort: number,
    endPort: number,
    errorMessage: string
}

export class InterfaceInfo implements IInterfaceInfo {
    isValid: boolean = true;
    type: string = undefined;
    shortName: string = undefined;
    longName: string = undefined;
    fullName: string = undefined;
    inputToken: string = undefined;
    inputTokenName: string = undefined;
    inputTokenNumber: string = undefined;
    slot: number = undefined;
    isRange: boolean = false;
    port: number = undefined;
    startPort: number = undefined;
    endPort: number = undefined;
    errorMessage: string = undefined;

    // check if a string is valid interface name or abbreviation
    // For the interface command, any valid interface can be used 
    // (GigabitEthernet[0-3]/[0-3], Gi[0-3]/[0-3], Port-channel[1-255], Po[1-255]). 
    // There can be space between interface type and number (i.e. “Gi0/0” is the same as “Gi 0/0”).
    // Loopback can apparently be any number
    static validateInterfaceId(token: string) {


        let shortName: string = undefined;
        let longName: string = undefined;
        let fullName: string = undefined;
        let numberToken: string = undefined;
        let isValid: boolean = true;
        let error: string = undefined;

        let data = undefined;
        let found = false;

        if (token !== undefined) {
            data = this.getInterfaceInfo(token);
            if (data.isValid) {

                shortName = data.shortName;
                longName = data.longName;

                //Validate interface name
                if (!shortName) {
                    isValid = false;
                    error = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
                }

                if (data.longName) {
                    if (longName && longName.toLowerCase() === "gigabitethernet" && data.slot === undefined) {
                        isValid = false;
                        error = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
                    }
                }
                else {
                    isValid = false;
                    error = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
                }
                if (data.port === undefined && (data.isRange === false)) {
                    isValid = false;
                    error = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
                }

                //Exceptional rules
                if (isValid === false) {
                    if (data.startPort > data.endPort) {
                        error = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
                    }
                }

                if (data.slot !== undefined && data.slot < 0 || data.slot > 3) {
                    isValid = false;
                    error = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
                }

                if (data.port !== undefined) {
                    if (longName !== undefined && longName.toLowerCase() === "gigabitethernet" && data.port < 0 || data.port > 3) {
                        isValid = false;
                        error = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
                    } else if (longName !== undefined && longName.toLowerCase() === "port-channel" && data.port < 1 || data.port > 64) {
                        isValid = false;
                        if (data.port === 0) {
                            error = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
                        }
                        else {
                            error = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
                        }
                    }
                }

                if (data.isRange === true && data.startPort !== undefined && data.startPort < 0 || data.startPort > 3) {
                    isValid = false;
                    error = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
                }

                if (data.isRange === true && data.endPort !== undefined && data.endPort < 0 || data.endPort > 3) {
                    isValid = false;
                    error = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
                }

                if (isValid) {
                    if (data.isRange === true) {
                        numberToken = data.slot + '/' + data.startPort + '-' + data.endPort;
                        fullName = longName + numberToken;
                    }
                    else {
                        if (longName.toLowerCase() === 'gigabitethernet') {
                            numberToken = data.slot + '/' + data.port;
                            fullName = longName + numberToken;
                        }
                        else {
                            numberToken = '' + data.port;
                            fullName = longName + numberToken;
                        }
                    }
                }
            }
            else {
                isValid = data.isValid;
                error = data.errorMessage;
            }
        }
        return {
            longName: longName,
            shortName: data.shortName,
            fullName: fullName,
            isValid: isValid,
            type: data.type,
            inputToken: data.inputToken,
            numberToken: numberToken,
            slot: data.slot,
            isRange: data.isRange,
            port: data.port,
            startPort: data.startPort,
            endPort: data.endPort,
            error: error
        }
    }

    //Parses interface name
    //Returns:  name (without slot/port)
    //          slot
    //          port
    static getInterfaceInfo(interfaceId: string) {

        let interfaceInfo = new InterfaceInfo();
        interfaceInfo.inputToken = interfaceId;

        let interfaceNames = [
            { longName: 'gigabitethernet', shortName: 'g', type: 'GigabitEthernet' },
            { longName: 'port-channel', shortName: 'p', type: 'Port-channel' },
            { longName: 'loopback', shortName: 'l', type: 'Loopback' }
        ]

        let slicePosition: number = interfaceId.length;
        for (let index: number = 0; index < interfaceId.length; index++) {
            let character: string = interfaceId.substr(index, 1);
            if (!isNaN(Number(character))) {
                slicePosition = index;
                break;
            }
        }

        if (slicePosition > 0) {
            interfaceInfo.inputTokenName = interfaceId.substr(0, slicePosition);
            interfaceInfo.inputTokenNumber = interfaceId.substr(slicePosition);
            let slotCheck: string = undefined;
            let portCheck: string = undefined;
            let slashPosition = interfaceInfo.inputTokenNumber.indexOf("/");
            if (slashPosition !== -1) {
                slotCheck = interfaceInfo.inputTokenNumber.substr(0, slashPosition);
                portCheck = interfaceInfo.inputTokenNumber.substr(slashPosition + 1);
                if (interfaceInfo.inputTokenNumber === "") interfaceInfo.inputTokenNumber = undefined;
                let tokens = new Array();
                tokens[0] = "";
                tokens[1] = "";
                let t = 0;
                let bolFoundDash: boolean = false;
                if (isNaN(Number(portCheck))) {
                    for (let index = 0; index < portCheck.length; index++) {
                        let character: string = portCheck[index];
                        if (isNaN(Number(character))) {
                            if (t === 0) {
                                if (index === 0) {
                                    interfaceInfo.isValid = false;
                                    interfaceInfo.errorMessage = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
                                    break;
                                }
                                else if (character !== '-') {
                                    interfaceInfo.isValid = false;
                                    interfaceInfo.errorMessage = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
                                    break;
                                } else {
                                    bolFoundDash = true;
                                }
                            }
                            else if (t === 1) {
                                break;
                            }
                            t++;
                            if (t >= 2) {
                                break;
                            }
                        }
                        else {
                            tokens[t] += character;
                        }
                    }
                    if (tokens[0] && tokens[0] !== "" && !isNaN(Number(tokens[0]))) {
                        interfaceInfo.startPort = Number(tokens[0]);
                    }
                    if (bolFoundDash) {
                        if (tokens[1] === undefined || tokens[1] === "" || isNaN(Number(tokens[1]))) {
                            interfaceInfo.isValid = false;
                            interfaceInfo.errorMessage = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
                        } else if (tokens[1] && tokens[1] !== "" && !isNaN(Number(tokens[1]))) {
                            interfaceInfo.endPort = Number(tokens[1]);
                        }
                    }
                } else {
                    if (portCheck === undefined || portCheck === "") {
                        interfaceInfo.isValid = false;
                        interfaceInfo.errorMessage = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
                    } else {
                        interfaceInfo.port = Number(portCheck);
                    }
                }
                if (!isNaN(Number(slotCheck))) {
                    interfaceInfo.slot = Number(slotCheck);
                }

            } else {
                //If there is no slash then the number is a port 
                if (interfaceInfo.inputTokenNumber && !isNaN(Number(interfaceInfo.inputTokenNumber))) {
                    interfaceInfo.port = Number(interfaceInfo.inputTokenNumber);
                }
            }
        }

        if (interfaceInfo.startPort !== undefined && interfaceInfo.endPort !== undefined) {
            interfaceInfo.isRange = true;
        }


        let checkName = interfaceInfo.inputTokenName;
        let longName = undefined;
        let shortName = undefined;
        let type = undefined;
        let foundInterfaceName = false;
        for (let index: number = 0; index < interfaceNames.length; index++) {
            longName = interfaceNames[index].longName;
            shortName = interfaceNames[index].shortName;
            type = interfaceNames[index].type;
            if (longName !== undefined && checkName !== undefined) {
                let result = CiscoValidators.validateIn(checkName, longName);
                if (result.isValid === true) {
                    foundInterfaceName = true;
                    break;
                }
            }
        }
        if (foundInterfaceName) {
            interfaceInfo.longName = longName;
            interfaceInfo.shortName = shortName;
            interfaceInfo.type = type;
        }

        return interfaceInfo;
    }

}

