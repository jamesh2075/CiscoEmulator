import { CommandConstants } from '../common/cisco-constants';
import { TerminalCommand } from '../../interfaces/terminal-command';
import { CiscoCommandContext } from '../cisco-terminal-command';
import { CommandState } from '../../interfaces/command-state';
import { VlanCommands } from './confterm-commands/vlan-commands';
import { noShutdownCommand } from './confinterface-commands/shutdown-command';
import { noSpanningTreeCommand } from './confterm-commands/spanning-tree-commands/no-spanning-tree-command';
import { noVtpCommand } from './confterm-commands/vtp-commands/vtp-command';


export class NoCommands {

    static UnsupportedConfTermNoCommands: TerminalCommand[] = [
        { name: 'aaa', description: `Authentication, Authorization and Accounting.` },
        { name: 'access-list', description: `Add an access list entry` },
        { name: 'access-session', description: `Access Sesion Global Configuration Commands` },
        { name: 'alias', description: `Create command alias` },
        { name: 'alps', description: `Configure Airline Protocol Support` },
        { name: 'ancp', description: `Configure ANCP` },
        { name: 'apollo', description: `Apollo global configuration commands` },
        { name: 'appletalk', description: `Appletalk global configuration commands` },
        { name: 'arap', description: `Appletalk Remote Access Protocol` },
        { name: 'archive', description: `Archive the configuration` },
        { name: 'arp', description: `Set a static ARP entry` },
        { name: 'async-bootp', description: `Modify system bootp parameters` },
        { name: 'authentication', description: `Auth Manager Global Configuration Commands` },
        { name: 'auto', description: `Configure Automation` },
        { name: 'autoconf', description: `Configure autoconf` },
        { name: 'banner', description: `Define a login banner` },
        { name: 'beep', description: `Configure BEEP (Blocks Extensible Exchange Protocol)` },
        { name: 'bfd', description: `BFD configuration commands` },
        { name: 'bfd-template', description: `BFD template configuration` },
        { name: 'boot', description: `Modify system boot parameters` },
        { name: 'bridge', description: `Bridge Group.` },
        { name: 'bridge-domain', description: `Bridge-domain global configuration commands` },
        { name: 'bstun', description: `BSTUN global configuration commands` },
        { name: 'buffers', description: `Adjust system buffer pool parameters` },
        { name: 'busy-message', description: `Display message when connection to host fails` },
        { name: 'captive-portal-bypass', description: `Enable Captive portal bypass for apple devices` },
        { name: 'cdp', description: `Global CDP configuration subcommands` },
        { name: 'cef', description: `Cisco Express Forwarding` },
        { name: 'chat-script', description: `Define a modem chat script` },
        { name: 'class-map', description: `Configure CPL Class Map` },
        { name: 'clns', description: `Global CLNS configuration subcommands` },
        { name: 'clock', description: `Configure time-of-day clock` },
        { name: 'cns', description: `CNS agents` },
        { name: 'configuration', description: `Configuration access` },
        { name: 'connect', description: `cross-connect two interfaces` },
        { name: 'control-plane', description: `Configure control plane services` },
        { name: 'crypto', description: `Encryption module` },
        { name: 'decnet', description: `Global DECnet configuration subcommands` },
        { name: 'default-value', description: `Default character-bits values` },
        { name: 'define', description: `interface range macro definition` },
        { name: 'device-sensor', description: `IOS Sensor Commands` },
        { name: 'dialer', description: `Dialer commands` },
        { name: 'dialer-list', description: `Create a dialer list entry` },
        { name: 'dlsw', description: `Data Link Switching global configuration commands` },
        { name: 'dnsix-dmdp', description: `Provide DMDP service for DNSIX` },
        { name: 'dnsix-nat', description: `Provide DNSIX service for audit trails` },
        { name: 'do-exec', description: `To run exec commands in config mode` },
        { name: 'dot1x', description: `IEEE 802.1X Global Configuration Commands` },
        { name: 'downward-compatible-config', description: `Generate a configuration compatible with older software` },
        { name: 'dspu', description: `DownStream Physical Unit Command` },
        { name: 'eap', description: `EAP Global Configuration Commands` },
        { name: 'enable', description: `Modify enable password parameters` },
        { name: 'end', description: `Exit from configure mode` },
        { name: 'energywise', description: `EnergyWise Global Configuration Commands` },
        { name: 'epm', description: `EPM Global Configuration Commands` },
        { name: 'errdisable', description: `Error disable` },
        { name: 'ethernet', description: `Ethernet configuration` },
        { name: 'event', description: `Event related configuration commands` },
        { name: 'exception', description: `Exception handling` },
        { name: 'exit', description: `Exit from configure mode` },
        { name: 'fallback', description: `Fallback configuration commands` },
        { name: 'fhrp', description: `Configure First Hop Redundancy Protocols` },
        { name: 'file', description: `Adjust file system parameters` },
        { name: 'flow', description: `Global Flow configuration subcommands` },
        { name: 'flow-sampler-map', description: `Flow sampler configuration` },
        { name: 'format', description: `Format the output` },
        { name: 'frame-relay', description: `global frame relay configuration commands` },
        { name: 'global-address-family', description: `Enter address-family base routing topology mode` },
        { name: 'hostname', description: `Set system's network name` },
        { name: 'hw-module', description: `Control of individual components in the system` },
        { name: 'id-manager', description: `ID Pool Manager` },
        { name: 'identity', description: `Identity Configuration Commands` },
        { name: 'interface', description: `Select an interface to configure` },
        { name: 'ip', description: `Global IP configuration subcommands` },
        { name: 'ipc', description: `Configure IPC system` },
        { name: 'ipv6', description: `Global IPv6 configuration commands` },
        { name: 'isis', description: `Global ISIS configuration subcommands` },
        { name: 'kerberos', description: `Configure Kerberos` },
        { name: 'key', description: `Key management` },
        { name: 'keymap', description: `Define a new keymap` },
        { name: 'kron', description: `Kron interval Facility` },
        { name: 'l2', description: `Layer 2 configuration` },
        { name: 'l2protocol-tunnel', description: `Tunnel Layer2 protocols` },
        { name: 'l2tp', description: `Layer 2 Tunneling Protocol (L2TP) parameters` },
        { name: 'l2tp-class', description: `l2tp-class configuration` },
        { name: 'lacp', description: `LACP configuration` },
        { name: 'lat', description: `DEC Local Area Transport (LAT) transmission protocol` },
        { name: 'li-view', description: `LI View` },
        { name: 'line', description: `Configure a terminal line` },
        { name: 'lldp', description: `Global LLDP configuration subcommands` },
        { name: 'lnm', description: `IBM Lan Manager` },
        { name: 'locaddr-priority-list', description: `Establish queueing priorities based on LU address` },
        { name: 'location', description: `Global location configuration commands` },
        { name: 'logging', description: `Modify message logging facilities` },
        { name: 'login', description: `Enable secure login checking` },
        { name: 'login-string', description: `Define a host-specific login string` },
        { name: 'mab', description: `MAC Authentication Bypass Global Configuration Commands` },
        { name: 'mac', description: `Global MAC configuration subcommands` },
        { name: 'macro', description: `Macro configuration` },
        { name: 'map-class', description: `Configure static map class` },
        { name: 'map-list', description: `Configure static map list` },
        { name: 'mediatrace', description: `Mediatrace Application` },
        { name: 'memory', description: `Configure memory management` },
        { name: 'memory-size', description: `Adjust memory size by percentage` },
        { name: 'menu', description: `Define a user-interface menu` },
        { name: 'metadata', description: `Metadata Application` },
        { name: 'modemcap', description: `Modem Capabilities database` },
        { name: 'monitor', description: `Monitoring different system events` },
        { name: 'mpls', description: `Configure MPLS parameters` },
        { name: 'multilink', description: `PPP multilink global configuration` },
        { name: 'ncia', description: `Native Client Interface Architecture` },
        { name: 'netbios', description: `NETBIOS access control filtering` },
        { name: 'netconf', description: `Configure NETCONF` },
        { name: 'nmsp', description: `NMSP configuration commands` },
        { name: 'ntp', description: `Configure NTP` },
        { name: 'object-group', description: `Configure Object Group` },
        { name: 'onep', description: `ONEP functionality` },
        { name: 'parameter-map', description: `Configure Parameter Map` },
        { name: 'parser', description: `Configure parser` },
        { name: 'partition', description: `Partition device` },
        { name: 'passthru-domain-list', description: `Domain name's associated with FQDN name` },
        { name: 'password', description: `Configure encryption password (key)` },
        { name: 'pnp', description: `Configure PNP` },
        { name: 'policy-map', description: `Configure Policy Map` },
        { name: 'port-channel', description: `EtherChannel configuration` },
        { name: 'port-security', description: `Security related command` },
        { name: 'priority-list', description: `Build a priority list` },
        { name: 'privilege', description: `Command privilege parameters` },
        { name: 'process', description: `Configure process` },
        { name: 'process-max-time', description: `Maximum time for process to run before voluntarily relinquishing processor` },
        { name: 'prompt', description: `Set system's prompt` },
        { name: 'pseudowire-class', description: `Pseudowire-class configuration` },
        { name: 'qos', description: `Global QoS configuration subcommands` },
        { name: 'queue-list', description: `Build a custom queue list` },
        { name: 'regexp', description: `regexp commands` },
        { name: 'resource', description: `Configure Resource settings` },
        { name: 'resume-string', description: `Define a host-specific resume string` },
        { name: 'rif', description: `Source-route RIF cache` },
        { name: 'rlogin', description: `Rlogin configuration commands` },
        { name: 'route-map', description: `Create route-map or enter route-map command mode` },
        { name: 'route-tag', description: `Route Tag` },
        { name: 'router', description: `Enable a routing process` },
        { name: 'rsrb', description: `RSRB LSAP/DSAP filtering` },
        { name: 'sampler', description: `Define a Sampler` },
        { name: 'sap-priority-list', description: `Establish queueing priorities based on SAP and/or MAC address(es)` },
        { name: 'sasl', description: `Configure SASL` },
        { name: 'scheduler', description: `Scheduler parameters` },
        { name: 'scripting', description: `Configure options for scripting languages` },
        { name: 'service', description: `Modify use of network based services` },
        { name: 'service-instance', description: `Configure a Static Service` },
        { name: 'service-list', description: `Enter the service list` },
        { name: 'service-policy', description: `Configure Global CPL Service Policy` },
        { name: 'service-routing', description: `Configure service-routing ` },
        { name: 'service-routing', description: `Configure service-routing ` },
        { name: 'service-template', description: `Configure a service-template/identity policy` },
        { name: 'shell', description: `Configure shell command` },
        { name: 'shutdown', description: `Shutdown system elements` },
        { name: 'smrp', description: `Simple Multicast Routing Protocol configuration commands` },
        { name: 'sna', description: `Network Management Physical Unit Command` },
        { name: 'snmp', description: `Modify non engine SNMP parameters` },
        { name: 'snmp-server', description: `Modify SNMP engine parameters` },
        { name: 'source', description: `Get config from another source` },
        { name: 'source-bridge', description: `Source-route bridging ring groups` },
        { name: 'stacks', description: `Configure stacks` },
        { name: 'standby', description: `Global HSRP configuration commands` },
        { name: 'state-machine', description: `Define a TCP dispatch state machine` },
        { name: 'stun', description: `STUN global configuration commands` },
        { name: 'subscriber-policy', description: `Subscriber policy` },
        { name: 'table-map', description: `Configure Table Map` },
        { name: 'tacacs-server', description: `Modify TACACS query parameters` },
        { name: 'tarp', description: `Global TARP configuration subcommands` },
        { name: 'template', description: `Select a template to configure` },
        { name: 'terminal-queue', description: `Terminal queue commands` },
        { name: 'tftp-server', description: `Provide TFTP service for netload requests` },
        { name: 'time-range', description: `Define time range entries` },
        { name: 'tn3270', description: `tn3270 configuration command` },
        { name: 'track', description: `Object tracking configuration commands` },
        { name: 'translate', description: `Translate global configuration commands` },
        { name: 'ttycap', description: `Define a new termcap` },
        { name: 'ttyscan', description: `Configure Line scanning delay time` },
        { name: 'udld', description: `Configure global UDLD setting` },
        { name: 'user-name', description: `Establish User Name Authentication` },
        { name: 'username', description: `Establish User Name Authentication` },
        { name: 'vines', description: `VINES global configuration commands` },
        { name: 'virtual-profile', description: `Virtual Profile configuration` },
        { name: 'virtual-template', description: `Virtual Template configuration` },
        { name: 'vrf', description: `VRF commands` },
        { name: 'vty-async', description: `Enable virtual async line configuration` },
        { name: 'wsma', description: `Configure Web Services Management Agents` },
        { name: 'x25', description: `X.25 Level 3` },
        { name: 'x29', description: `X29 commands` },
        { name: 'xconnect', description: `Xconnect config commands` },
        { name: 'xremote', description: `Configure XRemote` },
    ];
    static NoConfTermCommand: TerminalCommand = {
        name: 'no',
        description: 'Negate a command or set its defaults',
        parameters: [],
        handler: (cmdContext: CiscoCommandContext, cmdState: CommandState) => {
            // If only no is typed return incomplete command
            cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
            cmdState.stopProcessing = true;

            return cmdState;
        },
        children: [
            VlanCommands.noConfTermVlanCommand,
            noSpanningTreeCommand,
            noVtpCommand,
            ...NoCommands.UnsupportedConfTermNoCommands
        ]
    };

    static NoConfInterfaceCommand: TerminalCommand = {
        name: 'no',
        description: 'Negate a command or set its defaults',
        children: [
            noShutdownCommand
        ]
    };
}
