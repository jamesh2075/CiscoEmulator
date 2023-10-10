import { TerminalCommand } from "../../../../../emulator/interfaces/terminal-command";
import { NotSupportedCommand } from "../../../commands/notsupported";

export let unsupportedShowInterfacesCommands: TerminalCommand[] = [

  {name: 'Async', description: 'Async interface'},
  {name: 'Auto-Template', description: 'Auto-Template interface'},
  {name: 'BVI', description: 'Bridge-Group Virtual Interface'},
  {name: 'CTunnel', description: 'CTunnel interface'},
  {name: 'Dialer', description: 'Dialer interface'},
  {name: 'EsconPhy', description: 'ESCON interface'},
  {name: 'Filter', description: 'Filter interface'},
  {name: 'Filtergroup', description: 'Filter Group interface'},
  {name: 'GMPLS', description: 'MPLS interface'},
  {name: 'GroupVI', description: 'Group Virtual interface'},
  {name: 'LISP', description: 'Locator/ID Separation Protocol Virtual Interface'},
  {name: 'Loopback', description: 'Loopback interface'},
  {name: 'Lspvif', description: 'LSP virtual interface'},
  {name: 'MFR', description: 'Multilink Frame Relay bundle interface'},
  {name: 'Multilink', description: 'Multilink-group interface'},
  {name: 'Null', description: 'Null interface'},
  {name: 'Port-channel', description: 'Ethernet Channel of interfaces'},
  {name: 'Portgroup', description: 'Portgroup interface'},
  {name: 'Pos-channel', description: 'POS Channel of interfaces'},
  {name: 'SYSCLOCK', description: 'Telecom-Bus Clock Controller'},
  {name: 'Tunnel', description: 'Tunnel interface'},
  {name: 'Vif', description: 'PGM Multicast Host interface'},
  {name: 'Virtual-Template', description: 'Virtual Template interface'},
  {name: 'Virtual-TokenRing', description: 'Virtual TokenRing'},
  {name: 'Vlan', description: 'Catalyst Vlans'},
  {name: 'accounting', description: 'Show interface accounting'},
  {name: 'capabilities', description: 'Show interface capabilities information'},
  {name: 'counters', description: 'Show interface counters'},
  {name: 'crb', description: 'Show interface routing/bridging info'},
  {name: 'dampening', description: 'Show interface dampening info'},
  {name: 'debounce', description: 'Show interface debounce time info'},
  {name: 'etherchannel', description: 'Show interface etherchannel information'},
  {name: 'fair-queue', description: 'Show interface Weighted Fair Queueing (WFQ) info'},
  {name: 'fcpa', description: 'Fiber Channel'},
  {name: 'flowcontrol', description: 'Show interface flowcontrol information'},
  {name: 'history', description: 'Show interface history'},
  {name: 'irb', description: 'Show interface routing/bridging info'},
  {name: 'mac-accounting',description: 'Show interface MAC accounting info'},
  {name: 'mpls-exp', description: 'Show interface MPLS experimental accounting info'},
  {name: 'mtu', description: 'Show interface mtu'},
  {name: 'precedence', description: 'Show interface precedence accounting info'},
  {name: 'private-vlan', description: 'Show interface private vlan information'},
  {name: 'pruning', description: 'Show interface trunk VTP pruning information'},
  {name: 'random-detect', description: 'Show interface Weighted Random Early Detection (WRED) info'},
  {name: 'rate-limit', description: 'Show interface rate-limit info'},
  {name: 'stats', description: 'Show interface packets & octets, in & out, by switching path'},
  {name: 'summary', description: 'Show interface summary'},
  {name: 'voaBypassIn', description: 'VOA-Bypass-In interface'},
  {name: 'voaBypassOut', description: 'VOA-Bypass-Out interface'},
  {name: 'voaFilterIn', description: 'VOA-Filter-In interface'},
  {name: 'voaFilterOut', description: 'VOA-Filter-Out interface'},
  {name: 'voaIn', description: 'VOA-In interface'},
  {name: 'voaOut', description: 'VOA-Out interface'} 
];