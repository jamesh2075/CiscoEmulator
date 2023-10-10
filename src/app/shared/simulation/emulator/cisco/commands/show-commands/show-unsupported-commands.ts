import { TerminalCommand } from '../../../interfaces/terminal-command';
import { NotSupportedCommand } from "../notsupported";

let aaaCommand: TerminalCommand = {
    name: "aaa",
    description: 'Show AAA values',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let accessExpressionCommand: TerminalCommand = {
    name: "access-expression",
    description: 'List access expression',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let accessListsCommand: TerminalCommand = {
    name: "access-lists",
    description: 'List access lists',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let acircuitCommand: TerminalCommand = {
    name: "acircuit",
    description: 'Access circuit info',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let adjacencyCommand: TerminalCommand = {
    name: "adjacency",
    description: 'Adjacent nodes',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let aliasesCommand: TerminalCommand = {
    name: "aliases",
    description: 'Display alias commands',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let alpsCommand: TerminalCommand = {
    name: "alps",
    description: 'Alps information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let ancpCommand: TerminalCommand = {
    name: "ancp",
    description: 'ANCP information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let apolloCommand: TerminalCommand = {
    name: "apollo",
    description: 'Apollo network information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let appletalkCommand: TerminalCommand = {
    name: "appletalk",
    description: 'AppleTalk information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let applicationCommand: TerminalCommand = {
    name: "application",
    description: 'Application Routing',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let arapCommand: TerminalCommand = {
    name: "arap",
    description: 'Show Appletalk Remote Access statistics',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let archiveCommand: TerminalCommand = {
    name: "archive",
    description: 'Archive functions',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let arpCommand: TerminalCommand = {
    name: "arp",
    description: 'ARP table',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let asyncCommand: TerminalCommand = {
    name: "async",
    description: 'Information on terminal lines used as router interfaces',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let authenticationCommand: TerminalCommand = {
    name: "authentication",
    description: 'Shows Auth Manager stats, registrations or sessions',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let autoCommand: TerminalCommand = {
    name: "auto",
    description: 'Show Automation Template',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let backupCommand: TerminalCommand = {
    name: "backup",
    description: 'Backup status',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let bannerCommand: TerminalCommand = {
    name: "banner",
    description: 'Display banner information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let beepCommand: TerminalCommand = {
    name: "beep",
    description: 'Show BEEP information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let bfdCommand: TerminalCommand = {
    name: "bfd",
    description: 'BFD protocol info',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let bgpCommand: TerminalCommand = {
    name: "bgp",
    description: 'BGP information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let bootvarCommand: TerminalCommand = {
    name: "bootvar",
    description: 'Boot and related environment variable',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let bridgeCommand: TerminalCommand = {
    name: "bridge",
    description: 'Bridge Forwarding/Filtering Database [verbose',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let bridgeDomainCommand: TerminalCommand = {
    name: "bridge-domain",
    description: 'Bridge-domain',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let bscCommand: TerminalCommand = {
    name: "bsc",
    description: 'BSC interface information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let bstunCommand: TerminalCommand = {
    name: "bstun",
    description: 'BSTUN interface information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let buffersCommand: TerminalCommand = {
    name: "buffers",
    description: 'Buffer pool statistics',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let caaaCommand: TerminalCommand = {
    name: "caaa",
    description: 'Subscriber Policy Entity Information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let cacheCommand: TerminalCommand = {
    name: "cache",
    description: 'Shows Device-Sensor Cache Informations',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let calendarCommand: TerminalCommand = {
    name: "calendar",
    description: 'Display the hardware calendar',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let capabilityCommand: TerminalCommand = {
    name: "capability",
    description: 'Capability Information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let ccaCommand: TerminalCommand = {
    name: "cca",
    description: 'CCA information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let cceCommand: TerminalCommand = {
    name: "cce",
    description: 'Common Classification Engine (CCE',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let cdpCommand: TerminalCommand = {
    name: "cdp",
    description: 'CDP information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let cefCommand: TerminalCommand = {
    name: "cef",
    description: 'CEF address family independent status',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let classMapCommand: TerminalCommand = {
    name: "class-map",
    description: 'Show CPL Class Map',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let clnsCommand: TerminalCommand = {
    name: "clns",
    description: 'CLNS network information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let clockCommand: TerminalCommand = {
    name: "clock",
    description: 'Display the system clock',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let clsCommand: TerminalCommand = {
    name: "cls",
    description: 'DLC user information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let cnsCommand: TerminalCommand = {
    name: "cns",
    description: 'CNS agents',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let compressCommand: TerminalCommand = {
    name: "compress",
    description: 'Show compression statistics',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let configurationCommand: TerminalCommand = {
    name: "configuration",
    description: 'Contents of Non-Volatile memory',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let connectionCommand: TerminalCommand = {
    name: "connection",
    description: 'Show Connection',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let controllersCommand: TerminalCommand = {
    name: "controllers",
    description: 'Interface controller status',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let copsCommand: TerminalCommand = {
    name: "cops",
    description: 'COPS information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let cryptoCommand: TerminalCommand = {
    name: "crypto",
    description: 'Encryption module',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let dampeningCommand: TerminalCommand = {
    name: "dampening",
    description: 'Display dampening information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let dataCorruptionCommand: TerminalCommand = {
    name: "data-corruption",
    description: 'Show data errors',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let debuggingCommand: TerminalCommand = {
    name: "debugging",
    description: 'State of each debugging option',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let decnetCommand: TerminalCommand = {
    name: "decnet",
    description: 'DECnet information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let derivedConfigCommand: TerminalCommand = {
    name: "derived-config",
    description: 'Derived operating configuration',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let deviceSensorCommand: TerminalCommand = {
    name: "device-sensor",
    description: 'Shows Device Sensor Information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let dhcpCommand: TerminalCommand = {
    name: "dhcp",
    description: 'Dynamic Host Configuration Protocol status',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let dialerCommand: TerminalCommand = {
    name: "dialer",
    description: 'Dialer parameters and statistics',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let dlswCommand: TerminalCommand = {
    name: "dlsw",
    description: 'Data Link Switching information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let dnsixCommand: TerminalCommand = {
    name: "dnsix",
    description: 'Shows Dnsix/DMDP information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let dot1xCommand: TerminalCommand = {
    name: "dot1x",
    description: 'Dot1x information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let dripCommand: TerminalCommand = {
    name: "drip",
    description: 'DRiP DB',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let dspuCommand: TerminalCommand = {
    name: "dspu",
    description: 'Display DSPU information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let dtpCommand: TerminalCommand = {
    name: "dtp",
    description: 'DTP information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let dxiCommand: TerminalCommand = {
    name: "dxi",
    description: 'atm-dxi information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let eapCommand: TerminalCommand = {
    name: "eap",
    description: 'Shows EAP registration/session information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let eigrpCommand: TerminalCommand = {
    name: "eigrp",
    description: 'EIGRP show commands',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let energywiseCommand: TerminalCommand = {
    name: "energywise",
    description: 'EnergyWise show commands',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let entryCommand: TerminalCommand = {
    name: "entry",
    description: 'Queued terminal entries',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let epmCommand: TerminalCommand = {
    name: "epm",
    description: 'EPM information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let errdisableCommand: TerminalCommand = {
    name: "errdisable",
    description: 'Error disable',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let ethernetCommand: TerminalCommand = {
    name: "ethernet",
    description: 'Ethernet parameters',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let eventCommand: TerminalCommand = {
    name: "event",
    description: 'Embedded event related commands',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let exceptionCommand: TerminalCommand = {
    name: "exception",
    description: 'exception informations',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let fallbackCommand: TerminalCommand = {
    name: "fallback",
    description: 'Display Fallback configuration',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let fhrpCommand: TerminalCommand = {
    name: "fhrp",
    description: 'FHRP information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let fileCommand: TerminalCommand = {
    name: "file",
    description: 'Show filesystem information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let flash0Command: TerminalCommand = {
    name: "flash0",
    description: 'display information about flash0 file system',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let flash1Command: TerminalCommand = {
    name: "flash1",
    description: 'display information about flash1 file system',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let flash2Command: TerminalCommand = {
    name: "flash2",
    description: 'display information about flash2 file system',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let flash3Command: TerminalCommand = {
    name: "flash3",
    description: 'display information about flash3 file system',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let flashCommand: TerminalCommand = {
    name: "flash",
    description: 'display information about flash file system',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let flowCommand: TerminalCommand = {
    name: "flow",
    description: 'Flow information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let flowSamplerCommand: TerminalCommand = {
    name: "flow-sampler",
    description: 'Display the flow samplers configured',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let flowcontrolCommand: TerminalCommand = {
    name: "flowcontrol",
    description: 'show flow control information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let formatCommand: TerminalCommand = {
    name: "format",
    description: 'Show format information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let frameRelayCommand: TerminalCommand = {
    name: "frame-relay",
    description: 'Frame-Relay information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let frasCommand: TerminalCommand = {
    name: "fras",
    description: 'FRAS Information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let frasHostCommand: TerminalCommand = {
    name: "frasHost",
    description: 'FRAS Host Information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let funiCommand: TerminalCommand = {
    name: "funi",
    description: 'FUNI information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let glbpCommand: TerminalCommand = {
    name: "glbp",
    description: 'GLBP information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let historyCommand: TerminalCommand = {
    name: "history",
    description: 'Display the session command history',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let hostsCommand: TerminalCommand = {
    name: "hosts",
    description: 'IP domain-name, lookup style, nameservers, and host table',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let htmlCommand: TerminalCommand = {
    name: "html",
    description: 'HTML helper commands',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let idManagerCommand: TerminalCommand = {
    name: "id-manager",
    description: 'ID pool manager',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let idbCommand: TerminalCommand = {
    name: "idb",
    description: 'List of Interface Descriptor Blocks',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let identityCommand: TerminalCommand = {
    name: "identity",
    description: 'Identity profiles and policies',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let ifMgrCommand: TerminalCommand = {
    name: "if-mgr",
    description: 'if-mgr information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let inventoryCommand: TerminalCommand = {
    name: "inventory",
    description: 'Show the physical inventory',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let ipcCommand: TerminalCommand = {
    name: "ipc",
    description: 'Interprocess communications commands',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let ipv6Command: TerminalCommand = {
    name: "ipv6",
    description: 'IPv6 information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let isisCommand: TerminalCommand = {
    name: "isis",
    description: 'IS-IS routing information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let kerberosCommand: TerminalCommand = {
    name: "kerberos",
    description: 'Show Kerberos Values',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let keyCommand: TerminalCommand = {
    name: "key",
    description: 'Key information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let keymapCommand: TerminalCommand = {
    name: "keymap",
    description: 'Terminal keyboard mappings',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let kronCommand: TerminalCommand = {
    name: "kron",
    description: 'Kron Subsystem',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let l2protocolTunnelCommand: TerminalCommand = {
    name: "l2protocol-tunnel",
    description: 'Display L2PT status and configurations',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let lacpCommand: TerminalCommand = {
    name: "lacp",
    description: 'Port channel information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let latCommand: TerminalCommand = {
    name: "lat",
    description: 'DEC LAT information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let lineCommand: TerminalCommand = {
    name: "line",
    description: 'TTY line information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let llc2Command: TerminalCommand = {
    name: "llc2",
    description: 'IBM LLC2 circuit information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let lldpCommand: TerminalCommand = {
    name: "lldp",
    description: 'LLDP information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let lnmCommand: TerminalCommand = {
    name: "lnm",
    description: 'IBM LAN manager',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let localAckCommand: TerminalCommand = {
    name: "local-ack",
    description: 'Local Acknowledgement virtual circuits',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let locationCommand: TerminalCommand = {
    name: "location",
    description: 'Display the system location',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let loggingCommand: TerminalCommand = {
    name: "logging",
    description: 'Show the contents of logging buffers',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let loginCommand: TerminalCommand = {
    name: "login",
    description: 'Display Secure Login Configurations and State',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let mabCommand: TerminalCommand = {
    name: "mab",
    description: 'MAB information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let macCommand: TerminalCommand = {
    name: "mac",
    description: 'MAC configuration',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let macdbCommand: TerminalCommand = {
    name: "macdb",
    description: 'show MAC database',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let managementCommand: TerminalCommand = {
    name: "management",
    description: 'Display the management applications',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let mdnsCommand: TerminalCommand = {
    name: "mdns",
    description: 'MDNS feature',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let mediatraceCommand: TerminalCommand = {
    name: "mediatrace",
    description: 'Mediatrace show commands',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let memoryCommand: TerminalCommand = {
    name: "memory",
    description: 'Memory statistics',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let mfibCommand: TerminalCommand = {
    name: "mfib",
    description: 'MFIB address family independent status',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let modemcapCommand: TerminalCommand = {
    name: "modemcap",
    description: 'Show Modem Capabilities database',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let monitorCommand: TerminalCommand = {
    name: "monitor",
    description: 'Monitoring different system events',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let mplsCommand: TerminalCommand = {
    name: "mpls",
    description: 'MPLS information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let mtmCommand: TerminalCommand = {
    name: "mtm",
    description: 'MTM',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let nbfCommand: TerminalCommand = {
    name: "nbf",
    description: 'NBF (NetBEUI) information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let nciaCommand: TerminalCommand = {
    name: "ncia",
    description: 'Native Client Interface Architecture',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let netbiosCacheCommand: TerminalCommand = {
    name: "netbios-cache",
    description: 'NetBIOS name cache contents',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let netconfCommand: TerminalCommand = {
    name: "netconf",
    description: 'Show NETCONF information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let nmspCommand: TerminalCommand = {
    name: "nmsp",
    description: 'nmsp show commands',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let nodeCommand: TerminalCommand = {
    name: "node",
    description: 'Show known LAT nodes',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let ntpCommand: TerminalCommand = {
    name: "ntp",
    description: 'Network time protocol',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let objectGroupCommand: TerminalCommand = {
    name: "object-group",
    description: 'List object groups',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let odbCommand: TerminalCommand = {
    name: "odb",
    description: 'Opaque Database',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let odmFormatCommand: TerminalCommand = {
    name: "odm-format",
    description: 'Show the schema used for ODM input file',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let onepCommand: TerminalCommand = {
    name: "onep",
    description: 'ONEP related commands',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let pagpCommand: TerminalCommand = {
    name: "pagp",
    description: 'Port channel information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let parameterMapCommand: TerminalCommand = {
    name: "parameter-map",
    description: 'Show parameter map of type',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let parserCommand: TerminalCommand = {
    name: "parser",
    description: 'Display parser information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let pasCommand: TerminalCommand = {
    name: "pas",
    description: 'Port Adaptor Information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let pciCommand: TerminalCommand = {
    name: "pci",
    description: 'PCI Information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let performanceCommand: TerminalCommand = {
    name: "performance",
    description: 'Media Monitor show commands',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let persistentCommand: TerminalCommand = {
    name: "persistent",
    description: 'Show persistent information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let platformCommand: TerminalCommand = {
    name: "platform",
    description: 'Displays platform information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let pmCommand: TerminalCommand = {
    name: "pm",
    description: 'Show Port Manager commands',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let pnpCommand: TerminalCommand = {
    name: "pnp",
    description: 'Display PNP information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let policyManagerCommand: TerminalCommand = {
    name: "policy-manager",
    description: 'Policy Manager',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let policyMapCommand: TerminalCommand = {
    name: "policy-map",
    description: 'Show Policy Map',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let portSecurityCommand: TerminalCommand = {
    name: "port-security",
    description: 'Show secure port information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let pppCommand: TerminalCommand = {
    name: "ppp",
    description: 'PPP parameters and statistics',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let preCommand: TerminalCommand = {
    name: "pre",
    description: 'PRE show commands',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let privilegeCommand: TerminalCommand = {
    name: "privilege",
    description: 'Show current privilege level',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let processesCommand: TerminalCommand = {
    name: "processes",
    description: 'Active process statistics',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let protocolsCommand: TerminalCommand = {
    name: "protocols",
    description: 'Active network routing protocols',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let qosCommand: TerminalCommand = {
    name: "qos",
    description: 'Quality of Service show commands',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let queueCommand: TerminalCommand = {
    name: "queue",
    description: 'Show queue contents',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let queueingCommand: TerminalCommand = {
    name: "queueing",
    description: 'Show queueing configuration',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let radiusCommand: TerminalCommand = {
    name: "radius",
    description: 'Shows radius information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let rateLimitStatsCommand: TerminalCommand = {
    name: "rate-limit stats",
    description: 'Show rate limit enforcement information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let regionCommand: TerminalCommand = {
    name: "region",
    description: 'Region Manager Status',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let registryCommand: TerminalCommand = {
    name: "registry",
    description: 'Function registry information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let reloadCommand: TerminalCommand = {
    name: "reload",
    description: 'Scheduled reload information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let resourceCommand: TerminalCommand = {
    name: "resource",
    description: 'Resource group statistics',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let rhostsCommand: TerminalCommand = {
    name: "rhosts",
    description: 'Remote-host+user equivalences',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let ribCommand: TerminalCommand = {
    name: "rib",
    description: 'Routing Information Base',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let rifCommand: TerminalCommand = {
    name: "rif",
    description: 'RIF cache entries',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let routeMapCommand: TerminalCommand = {
    name: "route-map",
    description: 'route-map information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let routeTagCommand: TerminalCommand = {
    name: "route-tag",
    description: 'route-tag information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let rplCommand: TerminalCommand = {
    name: "rpl",
    description: 'RPL protocol status',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let samplerCommand: TerminalCommand = {
    name: "sampler",
    description: 'Sampler information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let saslCommand: TerminalCommand = {
    name: "sasl",
    description: 'show SASL information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let scalableQueueCommand: TerminalCommand = {
    name: "scalable-queue",
    description: 'Scalable Queue statistics',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let schedEventCommand: TerminalCommand = {
    name: "schedEvent",
    description: 'Scheduler event information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let sdllcCommand: TerminalCommand = {
    name: "sdllc",
    description: 'Display sdlc - llc2 conversion information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let serviceRoutingCommand: TerminalCommand = {
    name: "service-routing",
    description: 'Service-Routing show commands',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let serviceTemplateCommand: TerminalCommand = {
    name: "service-template",
    description: 'Show service-templates/identity policies',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let servicesCommand: TerminalCommand = {
    name: "services",
    description: 'LAT learned services',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let sessionsCommand: TerminalCommand = {
    name: "sessions",
    description: 'Information about Telnet connections',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let smfCommand: TerminalCommand = {
    name: "smf",
    description: 'Software MAC filter',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let smrpCommand: TerminalCommand = {
    name: "smrp",
    description: 'Simple Multicast Routing Protocol (SMRP) information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let snaCommand: TerminalCommand = {
    name: "sna",
    description: 'Display SNA host information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let snapshotCommand: TerminalCommand = {
    name: "snapshot",
    description: 'Snapshot parameters and statistics',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let snmpCommand: TerminalCommand = {
    name: "snmp",
    description: 'snmp statistics',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let socketsCommand: TerminalCommand = {
    name: "sockets",
    description: 'Socket Details',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let softwareCommand: TerminalCommand = {
    name: "software",
    description: 'List software information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let sourceBridgeCommand: TerminalCommand = {
    name: "source-bridge",
    description: 'Source-bridge parameters and statistics',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let sshCommand: TerminalCommand = {
    name: "ssh",
    description: 'Status of SSH server connections',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let ssmCommand: TerminalCommand = {
    name: "ssm",
    description: 'Segment Switching Manager Status',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let stacksCommand: TerminalCommand = {
    name: "stacks",
    description: 'Process stack utilization',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let standbyCommand: TerminalCommand = {
    name: "standby",
    description: 'Hot Standby Router Protocol (HSRP) information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let startupConfigCommand: TerminalCommand = {
    name: "startup-config",
    description: 'Contents of startup configuration',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let stunCommand: TerminalCommand = {
    name: "stun",
    description: 'STUN status and configuration',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let subscriberCommand: TerminalCommand = {
    name: "subscriber",
    description: 'Subscriber Service Switch Information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let subscriberPolicyCommand: TerminalCommand = {
    name: "subscriber-policy",
    description: 'Subscriber policy',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let subsysCommand: TerminalCommand = {
    name: "subsys",
    description: 'Show subsystem information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let tableMapCommand: TerminalCommand = {
    name: "table-map",
    description: 'Show Table Map',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let tacacsCommand: TerminalCommand = {
    name: "tacacs",
    description: 'Shows tacacs+ server statistics',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let tarpCommand: TerminalCommand = {
    name: "tarp",
    description: 'TARP information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let tcpCommand: TerminalCommand = {
    name: "tcp",
    description: 'Status of TCP connections',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let techSupportCommand: TerminalCommand = {
    name: "techSupport",
    description: 'Show system information for Tech-Support',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let templateCommand: TerminalCommand = {
    name: "template",
    description: 'Template information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let terminalCommand: TerminalCommand = {
    name: "terminal",
    description: 'Display terminal configuration parameters',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let test_rib_accessCommand: TerminalCommand = {
    name: "test_rib_access",
    description: 'RIB_ACCESS TEST info',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let timeRangeCommand: TerminalCommand = {
    name: "time-range",
    description: 'Time range',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let tn3270Command: TerminalCommand = {
    name: "tn3270",
    description: 'TN3270 settings',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let topologyCommand: TerminalCommand = {
    name: "topology",
    description: 'Topology instance information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let traceCommand: TerminalCommand = {
    name: "trace",
    description: 'Show trace options',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let trackCommand: TerminalCommand = {
    name: "track",
    description: 'Tracking information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let trafficShapeCommand: TerminalCommand = {
    name: "traffic-shape",
    description: 'traffic rate shaping configuration',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let translateCommand: TerminalCommand = {
    name: "translate",
    description: 'Protocol translation information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let ttycapCommand: TerminalCommand = {
    name: "ttycap",
    description: 'Terminal capability tables',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let tunnelCommand: TerminalCommand = {
    name: "tunnel",
    description: 'Show configured tunnels',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let udldCommand: TerminalCommand = {
    name: "udld",
    description: 'UDLD information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let udpCommand: TerminalCommand = {
    name: "udp",
    description: 'UDP Details',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let usersCommand: TerminalCommand = {
    name: "users",
    description: 'Display information about terminal lines',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let versionCommand: TerminalCommand = {
    name: "version",
    description: 'System hardware and software status',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let vfiCommand: TerminalCommand = {
    name: "vfi",
    description: 'Virtual Forwarding Instance information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let vinesCommand: TerminalCommand = {
    name: "vines",
    description: 'VINES information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
// let vlanCommand: TerminalCommand = {
//  name: "vlan",
//  description: 'VTP VLAN status' ,
//  parameters: [],
//  handler: NotSupportedCommand.NotSupported
// };
let vlansCommand: TerminalCommand = {
    name: "vlans",
    description: 'Virtual LANs Information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let vnetCommand: TerminalCommand = {
    name: "vnet",
    description: 'Virtual NETwork instance information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let vrfCommand: TerminalCommand = {
    name: "vrf",
    description: 'VPN Routing/Forwarding instance information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let vrrpCommand: TerminalCommand = {
    name: "vrrp",
    description: 'VRRP information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let vtemplateCommand: TerminalCommand = {
    name: "vtemplate",
    description: 'Virtual Template interface information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let wccpCommand: TerminalCommand = {
    name: "wccp",
    description: 'WCCP information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let whoamiCommand: TerminalCommand = {
    name: "whoami",
    description: 'Info on current tty line',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let wsmaCommand: TerminalCommand = {
    name: "wsma",
    description: 'Show Web Services Management Agents information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let x25Command: TerminalCommand = {
    name: "x25",
    description: 'X.25 information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let x29Command: TerminalCommand = {
    name: "x29",
    description: 'X.29 information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let xconnectCommand: TerminalCommand = {
    name: "xconnect",
    description: 'xconnect information',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let xosCommand: TerminalCommand = {
    name: "xos",
    description: 'Cross-OS Library Information and Traces',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let xremoteCommand: TerminalCommand = {
    name: "xremote",
    description: 'XRemote statistics',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let xsdFormatCommand: TerminalCommand = {
    name: "xsdFormat",
    description: 'Show the ODM XSD for the command',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};


export let unsupportedShowCommands = [
    aaaCommand,
    accessExpressionCommand,
    accessListsCommand,
    acircuitCommand,
    adjacencyCommand,
    aliasesCommand,
    alpsCommand,
    ancpCommand,
    apolloCommand,
    appletalkCommand,
    applicationCommand,
    arapCommand,
    archiveCommand,
    arpCommand,
    asyncCommand,
    authenticationCommand,
    autoCommand,
    backupCommand,
    bannerCommand,
    beepCommand,
    bfdCommand,
    bgpCommand,
    bootvarCommand,
    bridgeCommand,
    bridgeDomainCommand,
    bscCommand,
    bstunCommand,
    buffersCommand,
    caaaCommand,
    cacheCommand,
    calendarCommand,
    capabilityCommand,
    ccaCommand,
    cceCommand,
    cdpCommand,
    cefCommand,
    classMapCommand,
    clnsCommand,
    clockCommand,
    clsCommand,
    cnsCommand,
    compressCommand,
    configurationCommand,
    connectionCommand,
    controllersCommand,
    copsCommand,
    cryptoCommand,
    dampeningCommand,
    dataCorruptionCommand,
    debuggingCommand,
    decnetCommand,
    derivedConfigCommand,
    deviceSensorCommand,
    dhcpCommand,
    dialerCommand,
    dlswCommand,
    dnsixCommand,
    dot1xCommand,
    dripCommand,
    dspuCommand,
    dtpCommand,
    dxiCommand,
    eapCommand,
    eigrpCommand,
    energywiseCommand,
    entryCommand,
    epmCommand,
    errdisableCommand,
    ethernetCommand,
    eventCommand,
    exceptionCommand,
    fallbackCommand,
    fhrpCommand,
    fileCommand,
    flash0Command,
    flash1Command,
    flash2Command,
    flash3Command,
    flashCommand,
    flowCommand,
    flowSamplerCommand,
    flowcontrolCommand,
    formatCommand,
    frameRelayCommand,
    frasCommand,
    frasHostCommand,
    funiCommand,
    glbpCommand,
    historyCommand,
    hostsCommand,
    htmlCommand,
    idManagerCommand,
    idbCommand,
    identityCommand,
    ifMgrCommand,
    inventoryCommand,
    ipcCommand,
    ipv6Command,
    isisCommand,
    kerberosCommand,
    keyCommand,
    keymapCommand,
    kronCommand,
    l2protocolTunnelCommand,
    lacpCommand,
    latCommand,
    lineCommand,
    llc2Command,
    lldpCommand,
    lnmCommand,
    localAckCommand,
    locationCommand,
    loggingCommand,
    loginCommand,
    mabCommand,
    macCommand,
    macdbCommand,
    managementCommand,
    mdnsCommand,
    mediatraceCommand,
    memoryCommand,
    mfibCommand,
    modemcapCommand,
    monitorCommand,
    mplsCommand,
    mtmCommand,
    nbfCommand,
    nciaCommand,
    netbiosCacheCommand,
    netconfCommand,
    nmspCommand,
    nodeCommand,
    ntpCommand,
    objectGroupCommand,
    odbCommand,
    odmFormatCommand,
    onepCommand,
    pagpCommand,
    parameterMapCommand,
    parserCommand,
    pasCommand,
    pciCommand,
    performanceCommand,
    persistentCommand,
    platformCommand,
    pmCommand,
    pnpCommand,
    policyManagerCommand,
    policyMapCommand,
    portSecurityCommand,
    pppCommand,
    preCommand,
    privilegeCommand,
    processesCommand,
    protocolsCommand,
    qosCommand,
    queueCommand,
    queueingCommand,
    radiusCommand,
    rateLimitStatsCommand,
    regionCommand,
    registryCommand,
    reloadCommand,
    resourceCommand,
    rhostsCommand,
    ribCommand,
    rifCommand,
    routeMapCommand,
    routeTagCommand,
    rplCommand,
    samplerCommand,
    saslCommand,
    scalableQueueCommand,
    schedEventCommand,
    sdllcCommand,
    serviceRoutingCommand,
    serviceTemplateCommand,
    servicesCommand,
    sessionsCommand,
    smfCommand,
    smrpCommand,
    snaCommand,
    snapshotCommand,
    snmpCommand,
    socketsCommand,
    softwareCommand,
    sourceBridgeCommand,
    sshCommand,
    ssmCommand,
    stacksCommand,
    standbyCommand,
    startupConfigCommand,
    stunCommand,
    subscriberCommand,
    subscriberPolicyCommand,
    subsysCommand,
    tableMapCommand,
    tacacsCommand,
    tarpCommand,
    tcpCommand,
    techSupportCommand,
    templateCommand,
    terminalCommand,
    test_rib_accessCommand,
    timeRangeCommand,
    tn3270Command,
    topologyCommand,
    traceCommand,
    trackCommand,
    trafficShapeCommand,
    translateCommand,
    ttycapCommand,
    tunnelCommand,
    udldCommand,
    udpCommand,
    usersCommand,
    versionCommand,
    vfiCommand,
    vinesCommand,
    //vlanCommand,
    vnetCommand,
    vrfCommand,
    vrrpCommand,
    vtemplateCommand,
    wccpCommand,
    whoamiCommand,
    wsmaCommand,
    x25Command,
    x29Command,
    xconnectCommand,
    xosCommand,
    xremoteCommand,
    xsdFormatCommand
];