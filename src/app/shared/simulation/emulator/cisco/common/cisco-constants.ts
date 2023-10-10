import { CiscoUtils } from "./cisco-utils";

enum Command {
    VLAN,
    PRIORITY
}

export const CommandConstants = {
    VLAN: { name: 'vlan', min: 1, max: 4094 },
    SPANNINGBRIDGE: { name: 'spanningbridge', min: 1, max: 255 },
    ETHERCHANNEL: { min: 1, max: 255, auto: 'auto' },
    ERROR_MESSAGES: {
        INCOMPLETE_COMMAND: '% Incomplete command',
        INVALID_INPUT: '% Invalid input detected',
        AMBIGUOUS_COMMAND: '% Ambiguous command: ',
        UNRECOGNIZED_COMMANDS: '% Unrecognized command',
        UNSUPPORTED_COMMAND: 'This command is not supported.',
        UNIMPLEMENTED_COMMAND: '% Command not implemented',
        REJECTED_ENCAPSULATION_COMMAND: 'Command rejected: A port which is configured to "trunk" mode can not be configured to negotiate the encapsulation.',
        BAD_LIST: 'badList',
        EXCEPTION: '% Internal simulation error, see console log for details',
        REJECTED_MODE_COMMAND: 'Command Rejected: An interface whose trunk encapsulation is "Auto" can not be configured to "trunk" mode',
        VRF_PORT: 'Command rejected: ' + CiscoUtils.getVrfPort().shortName + ' is a VRF-enabled port.'
    },
    PRIORITY: {
        name: 'priority',
        rangeValues: [0, 4096, 8192, 12288, 16384, 20480, 24576, 28672, 32768, 36864, 40960, 45056, 49152, 53248, 57344, 61440]
    },
    EVENTS: {
        SIMULATION_INIT: "simulationInit",
        CHANNEL_GROUP_CHANGED: "channelGroupChanged",
        INTERFACE_ADDED: "interfaceAdded",
        INTERFACE_REMOVED: "interfaceRemoved",
        SHUTDOWN: "shutdown",
        NO_SHUTDOWN: "noShutdown",
        CONNECT_TO_VLAN: "connectToVlan",
        NO_PORT_CHANNEL: "onRemovePortChannel",
        ADD_VLANS: 'addVlans',
        VLAN_ADDED: "vlanAdded",
        VLAN_REMOVED: "vlanRemoved",
        VLAN_CHANGED: "vlanChanged",
    }
};


