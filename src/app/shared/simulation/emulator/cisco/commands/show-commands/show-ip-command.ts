import * as Mustache from 'mustache';
import { TerminalCommand } from '../../../interfaces/terminal-command';
import { CommandState } from '../../../interfaces/command-state';
import { CiscoCommandContext } from '../../cisco-terminal-command';
import { NotSupportedCommand } from '../notsupported';
import { CiscoFormatters } from '../../common/cisco-formatters';

const ipInterfaceTemplate =
    `{{#interfaces}}{{#decode}}{{name}}{{/decode}} is {{#setStatus}}{{status}}{{/setStatus}}, line protocol is {{status}}
  {{#showIpAddress}}Internet address is {{ipv4}}{{#subnet}}/{{subnet}}{{/subnet}}
  Broadcast address is {{ipv4Mask}}
  Address determined by non-volatile memory
  MTU is 1500 bytes
  Helper address is not set
  Directed broadcast forwarding is disabled
  Outgoing access list is not set
  Inbound  access list is not set
  Proxy ARP is enabled
  Local Proxy ARP is disabled
  Security level is default
  Split horizon is enabled
  ICMP redirects are always sent
  ICMP unreachables are always sent
  ICMP mask replies are never sent
  IP fast switching is enabled
  IP Flow switching is disabled
  IP CEF switching is enabled
  IP CEF switching turbo vector
  IP Null turbo vector
  VPN Routing/Forwarding 'Mgmt-intf'
  IP multicast fast switching is enabled
  IP multicast distributed fast switching is disabled
  IP route-cache flags are Fast, CEF
  Router Discovery is disabled
  IP output packet accounting is disabled
  IP access violation accounting is disabled
  TCP/IP header compression is disabled
  RTP/IP header compression is disabled
  Probe proxy name replies are disabled
  Policy routing is disabled
  Network address translation is disabled
  BGP Policy Mapping is disabled
  Input features: MCI Check
  IPv4 WCCP Redirect outbound is disabled
  IPv4 WCCP Redirect inbound is disabled
  IPv4 WCCP Redirect exclude is disabled{{/showIpAddress}}
  {{^showIpAddress}}Inbound  access list is not set{{/showIpAddress}}
{{/interfaces}}
`;
const ipInterfaceBriefTemplate = `
Interface              IP-Address\tOK? Method Status\t\t  Protocol
{{#interfaces}}
{{#padInterface}}{{#decode}}{{name}}{{/decode}}{{/padInterface}}{{#ipv4}}{{/ipv4}}{{ipv4}}{{^ipv4}}unassigned{{/ipv4}}\tYES {{#setMethod}}{{method}}{{/setMethod}}  {{#setStatus}}{{status}}{{/setStatus}} {{protocol}}
{{/interfaces}}`;


export class ShowIpCommand {
    static command: TerminalCommand =
    {
        name: 'ip',
        description: 'IP information',
        parameters: [],
        handler: NotSupportedCommand.NotSupported,
        children: [
            {
                name: 'interface',
                description: 'IP interface status and configuration',
                handler: (cmdContext: CiscoCommandContext, cmdState: CommandState) => {
                    cmdState.stopProcessing = true;
                    let result = '';
                    const interfaces = cmdContext.device.model.interfaces;
                    interfaces.forEach(function (iface: any) {
                        if (iface.name === 'GigabitEthernet0\/0') {
                            result += `${iface.name} is ${iface.status}, line protocl is ${iface.status}
  Internet address is ${iface.ipv4}/${iface.subnet}
  Broadcast address is ${iface.ipv4Mask}
  Address determined by non-volatile memory
  MTU is 1500 bytes
  Helper address is not set
  Directed broadcast forwarding is disabled
  Outgoing access list is not set
  Inbound  access list is not set
  Proxy ARP is enabled
  Local Proxy ARP is disabled
  Security level is default
  Split horizon is enabled
  ICMP redirects are always sent
  ICMP unreachables are always sent
  ICMP mask replies are never sent
  IP fast switching is enabled
  IP Flow switching is disabled
  IP CEF switching is enabled
  IP CEF switching turbo vector
  IP Null turbo vector
  VPN Routing/Forwarding 'Mgmt-intf'
  IP multicast fast switching is enabled
  IP multicast distributed fast switching is disabled
  IP route-cache flags are Fast, CEF
  Router Discovery is disabled
  IP output packet accounting is disabled
  IP access violation accounting is disabled
  TCP/IP header compression is disabled
  RTP/IP header compression is disabled
  Probe proxy name replies are disabled
  Policy routing is disabled
  Network address translation is disabled
  BGP Policy Mapping is disabled
  Input features: MCI Check
  IPv4 WCCP Redirect outbound is disabled
  IPv4 WCCP Redirect inbound is disabled
  IPv4 WCCP Redirect exclude is disabled \n`;
                                    // result += 'Internet address is ${iface.ipv4}\/${iface.subnet} \n';
                                    // result += 'Broadcast address is ${iface.ipv4Mask}';
                                    // result += 'Address determined by non-volatile memory';
                                    // result += 'MTU is 1500 bytes';
                        } else if (iface.name === 'Loopback0') {
                            result += `${iface.name} is ${iface.status}, line protocl is ${iface.status}
  Internet protocol processing disabled \n`;
                        } else if (iface.status === 'admin down') {
                            result += `${iface.name} is administratively down, line protocl is down
  Inbound access list is not set \n`;
                        } else {
                            result += `${iface.name} is ${iface.status}, line protocl is ${iface.status}
  Inbound access list is not set \n`;
                        }
                    });
                    cmdState.output  = result;
                },
                children: [{
                    name: 'brief',
                    description: 'Brief summary of IP interface status and configuration',
                    handler: (cmdContext: CiscoCommandContext, cmdState: CommandState) => {
                        const isSw1: boolean = cmdContext.device.name.toUpperCase() === 'SW1';
                        const isSw2: boolean = !isSw1;
                        // console.log('I am executing this');
                        try {
                            const rendered: string = Mustache.render(ipInterfaceBriefTemplate, {
                                interfaces: cmdContext.device.property('interfaces'),
                                decode: function () {
                                    return function (text: string, render: any) {
                                        const decodedText = render(text).replace('&#x2F;', '/');
                                        return decodedText;
                                    };
                                },
                                setStatus: function () {
                                    return function (text: string, render: any) {
                                        let status = render(text);
                                        if (status === '') {
                                            status = render('{{portstatus}}');
                                        }
                                        if (status.toLocaleLowerCase() === 'down' || status.toLocaleLowerCase() === 'admin down') {
                                            status = 'administratively down';
                                        }
                                        let space = '';
                                        while (space.length <= 21) {
                                            space += ' ';
                                        }
                                        status = CiscoFormatters.padRight(status, space);
                                        return status;
                                    };
                                },
                                setMethod: function(){
                                    return function (text: string, render: any) {
                                        let method = render(text);
                                        if (method === '') {
                                            method = render ('       ');
                                        }
                                        let space = '';
                                        while (space.length <= 7) {
                                            space += ' ';
                                        }
                                        method = CiscoFormatters.padRight(method, space);
                                        return method;
                                    };
                                },
                                padInterface: function () {
                                    return function (text: string, render: any) {
                                        let paddedText = render(text);

                                        let space = '';
                                        while (space.length <= 22) {
                                            space += ' ';
                                        }
                                        paddedText = CiscoFormatters.padRight(paddedText, space);

                                        return paddedText;
                                    };
                                }
                            });

                            console.log('I am not  executing this');
                            cmdState.output = rendered;
                            cmdState.stopProcessing = true;
                        } catch (error) {
                            console.log(error);
                        }
                        return cmdState;
                    }
                }]
                // }, {
                //    name: 'gigabitethernet',
                //     description: '',
                //     parameters: [],
                //     handler: (cmdContext: CiscoCommandContext, cmdState: CommandState) => {
                //         //debugger;
                //         let result: string = '';
                //         let interfaces = cmdContext.device.model.interfaces;
                //         try {
                //         interfaces.forEach(function (iface: any) {
                //             debugger;
                //             if (iface.name === 'GigabitEthernet0\/0') {
                //                 let adminStatus = (iface.status === 'admin down') ? 'administratively down' : iface.status;
                //                 result = `${iface.name} is ${adminStatus}, line protocl is ${iface.status}\n`;
                //                 result += `  Inbound access list is not set \n`;
                //             }
                //         });

                //         } catch (error) {
                //                 console.log(error)
                //         }
                //         cmdState.output  = result;
                //         return cmdState;
                //     }
                // }]
            },
            { name: 'access-lists', description: `List IP access lists` },
            { name: 'accounting', description: `The active IP accounting database` },
            { name: 'admission', description: `Network Admission Control information` },
            { name: 'aliases', description: `IP alias table` },
            { name: 'arp', description: `IP ARP table` },
            { name: 'as-path-access-list', description: `List AS path access lists` },
            { name: 'bgp', description: `BGP information` },
            { name: 'cache', description: `IP fast-switching route cache` },
            { name: 'casa', description: `display casa information` },
            { name: 'cef', description: `Cisco Express Forwarding` },
            { name: 'community-list', description: `List community-list` },
            { name: 'device', description: `Show IP Tracking Hosts` },
            { name: 'dfp', description: `DFP information` },
            { name: 'dhcp', description: `Show items in the DHCP database` },
            { name: 'drp', description: `Director response protocol` },
            { name: 'eigrp', description: `Show IPv4 EIGRP ` },
            { name: 'explicit-paths', description: `Show IP explicit paths` },
            { name: 'extcommunity-list', description: `List extended-community list` },
            { name: 'flow', description: `NetFlow switching` },
            { name: 'helper-address', description: `helper-address table` },
            { name: 'host', description: `IP host information` },
            { name: 'http', description: `HTTP information` },
            { name: 'igmp', description: `IGMP information` },
            { name: 'irdp', description: `ICMP Router Discovery Protocol` },
            { name: 'local', description: `IP local options` },
            { name: 'masks', description: `Masks associated with a network` },
            { name: 'mfib', description: `IP multicast forwarding information base` },
            { name: 'mrib', description: `Multicast Routing Information Base` },
            { name: 'mrm', description: `IP Multicast Routing Monitor information` },
            { name: 'mroute', description: `IP multicast routing table` },
            { name: 'msdp', description: `Multicast Source Discovery Protocol (MSDP)` },
            { name: 'multicast', description: `Multicast global information` },
            { name: 'nat', description: `IP NAT information` },
            { name: 'nbar', description: `Network-Based Application Recognition` },
            { name: 'ospf', description: `OSPF information` },
            { name: 'pgm', description: `PGM Reliable Transport Protocol` },
            { name: 'pim', description: `PIM information` },
            { name: 'policy', description: `Policy routing` },
            { name: 'policy-list', description: `List IP Policy list` },
            { name: 'port-map', description: `Port to Application Mapping (PAM) information` },
            { name: 'prefix-list', description: `List IP prefix lists` },
            { name: 'protocols', description: `IP routing protocol process parameters and statistics` },
            { name: 'redirects', description: `IP redirects` },
            { name: 'rib', description: `Routing Information Base` },
            { name: 'rip', description: `IP RIP show commands` },
            { name: 'route', description: `IP routing table` },
            { name: 'rpf', description: `Display RPF information for multicast source` },
            { name: 'rsvp', description: `RSVP information` },
            { name: 'rtp', description: `RTP/UDP/IP header-compression statistics` },
            { name: 'sap', description: `Session Announcement Protocol cache` },
            { name: 'sla', description: `Service Level Agreement (SLA)` },
            { name: 'slb', description: `SLB information` },
            { name: 'sockets', description: `Open IP sockets` },
            { name: 'source', description: `IP source` },
            { name: 'ssh', description: `Information on SSH` },
            { name: 'static', description: `Static operation` },
            { name: 'tcp', description: `TCP/IP header-compression statistics` },
            { name: 'traffic', description: `IP protocol statistics` },
            { name: 'trigger-authentication', description: `Trigger-authentication host table` },
            { name: 'verify', description: `Ip verify` },
            { name: 'vrf', description: `VPN Routing/Forwarding instance information` },
            { name: 'wccp', description: `WCCP IPv4 information` },

        ]
    };
}
