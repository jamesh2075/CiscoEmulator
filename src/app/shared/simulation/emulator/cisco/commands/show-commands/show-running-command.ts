import * as Mustache from 'mustache';
import { TerminalCommand } from "../../../interfaces/terminal-command";
import { CommandState } from '../../../interfaces/command-state';
import { CiscoCommandContext } from '../../cisco-terminal-command';
import { ICiscoInterface } from '../../icisco-device';
import { NotSupportedCommand } from "../notsupported";
import { switchportDefaultDataModel } from '../confinterface-commands/switchport-command';
import { GigabitEthernet, ChannelGroup } from "../../model/gigabitethernet.model";
import { Vlan } from "../../model/vlan.model";
import { Device } from "../../model/device.model";
import { CiscoDevice } from "../../cisco-device";
import { Loopback} from "../../model/loopback.model";
import { Port} from "../../model/port.model";
import { Interface} from "../../model/interface.model";
import { SpanningTree } from "../../model/spanning-tree.model"
import { Switchport, SwitchportPrivateVlan} from "../../model/switchport.model"
import { property } from "../../model/utils/property"
import { CiscoFormatters } from "../../common/cisco-formatters"
import { CommandConstants } from "../../common/cisco-constants"

// TODO: Figure out a way to have mustache NOT render blank lines when no data is available.
//       Then we can show {{placeholders}} within the template in a more intuitive way.
let interfaceSpecificTemplate = `{{#showInterface}}Building configuration...

Current configuration : 136 bytes
!
{{#loopback}}interface {{{name}}}{{#showDescription}}\n description {{{description}}}{{/showDescription}}\n no ip address{{#showChannelGroup}}{{{name}}}{{/showChannelGroup}}{{#showSwitchport}}{{{name}}}{{/showSwitchport}}{{#showShutdown}}\n shutdown{{/showShutdown}}
!{{/loopback}}{{#port}}interface {{{name}}}{{#showDescription}}\n description {{{description}}}{{/showDescription}}{{#showSwitchport}}{{{name}}}{{/showSwitchport}}{{#showShutdown}}\n shutdown{{/showShutdown}}
!{{/port}}{{#interface}}interface {{{name}}}{{#showDescription}}\n description {{{description}}}{{/showDescription}}{{#showSwitchport}}{{{name}}}{{/showSwitchport}}{{#showShutdown}}\n shutdown{{/showShutdown}}{{#showIpAddress}}{{ipv4}} {{ipv4Mask}}{{/showIpAddress}}{{#showNegotiation}}{{/showNegotiation}}{{#showCdp}}{{/showCdp}}{{#showChannelGroup}}{{{name}}}{{/showChannelGroup}}
!{{/interface}}{{/showInterface}}
`

let template: string = `Building configuration... \n \n
Current configuration : 2465 bytes
!
! Last configuration change at 17:19:46 UTC Mon May 15 2017
!
version 15.2
service timestamps debug datetime msec
service timestamps log datetime msec
no service password-encryption
service compress-config
!
hostname {{device.name}}
!
boot-start-marker
boot-end-marker
!
!
vrf definition Mgmt-intf
 !
 address-family ipv4
 exit-address-family
 !
 address-family ipv6
 exit-address-family
!
!
no aaa new-model
no process cpu extended history
!
!
!
!
!{{#showVtp}}\nvtp domain {{device.model.vtp.domain}}\nvtp mode {{device.model.vtp.mode}}{{/showVtp}}
!
!
!
no ip domain-lookup
ip cef
no ipv6 cef
!
!
!{{#showSpanningTree}}
!{{/showSpanningTree}}
vlan internal allocation policy ascending
!{{#showVlans}}{{/showVlans}}
!
!
!
!
!
!
!
!
!
!
!
!
!
!
{{#loopbacks}}interface {{{name}}}{{#showDescription}}\n description {{{description}}}{{/showDescription}}
 no ip address
{{/loopbacks}}!
{{#ports}}interface {{{name}}}{{#showDescription}}\n description {{{description}}}{{/showDescription}}{{#showSwitchport}}{{{name}}}{{/showSwitchport}}{{#showShutdown}}\n shutdown{{/showShutdown}}\n!
{{/ports}}
{{#interfaces}}interface {{{name}}}{{#showDescription}}\n description {{{description}}}{{/showDescription}}{{#showSwitchport}}{{{name}}}{{/showSwitchport}}{{#showShutdown}}\n shutdown{{/showShutdown}}{{#showIpAddress}}{{ipv4}} {{ipv4Mask}}{{/showIpAddress}}{{#showNegotiation}}{{autoNegotiation}}{{/showNegotiation}}{{#showCdp}}{{cdpEnabled}}{{/showCdp}}{{#showChannelGroup}}{{{name}}}{{/showChannelGroup}}
!
{{/interfaces}}!
ip forward-protocol nd
!
no ip http server
no ip http secure-server
!
!
!
!
!
!
control-plane
!
!
line con 0
line aux 0
line vty 0 4
 exec-timeout 720 0
 password cisco
 login
 transport input telnet ssh
!
!
end
`;

export class ShowRunningCommand {
    static command: TerminalCommand = {
        name: "running-config",
        description: 'Current operating configuration',
        parameters: [],
        children: [
            { name: "aaa", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "all", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "brief", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "class-map", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "eap", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "flow", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "full", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "identity", description: "", handler: NotSupportedCommand.NotSupported },
            {
                name: "interface", description: "", handler: (cmdContext: CiscoCommandContext, cmdState: CommandState) => {
                },
                children: [
                    {
                        name: "id", description: "", validator: () => true, parameters:["(word)"], handler: (cmdContext: CiscoCommandContext, cmdState: CommandState) => {
                            var token = cmdState.command.token.toLowerCase();
                            if (cmdState.command.parameters && (Object.keys(cmdState.command.parameters).length === 1))
                                token += cmdState.command.parameters[0];
                            let rendered: string = Mustache.render(interfaceSpecificTemplate,
                                {
                                    model: cmdContext.device.model,
                                    device: cmdContext.device,
                                    showInterface: function () {
                                        return function (text: string, render: any) {
                                            let data = '';
                                            let foundInterface = ShowRunningCommand.findInterface(cmdContext, token);
                                            if (foundInterface) {
                                                data = render(text);
                                            }
                                            else {
                                                data = "% Invalid input detected"
                                            }

                                            return data;
                                        }
                                    },
                                    interface: function () {
                                        let foundInterface = ShowRunningCommand.findInterface(cmdContext, token);
                                        return foundInterface instanceof GigabitEthernet ? foundInterface : null;
                                    },
                                    port: function() {
                                        let foundInterface = ShowRunningCommand.findInterface(cmdContext, token);
                                        return foundInterface instanceof Port ? foundInterface : null;
                                    },
                                    loopback: function() {
                                        let foundInterface = ShowRunningCommand.findInterface(cmdContext, token);
                                        return foundInterface instanceof Loopback ? foundInterface : null;
                                    },
                                    showDescription:() => ShowRunningCommand.createShowDescriptionDelegate(cmdContext, cmdState),
                                    showSwitchport: () => ShowRunningCommand.createShowSwitchportDelegate(cmdContext, cmdState),
                                    showShutdown: () => ShowRunningCommand.createShowShutdownDelegate(cmdContext, cmdState),
                                    showIpAddress:() => ShowRunningCommand.showIpAddress,
                                    showNegotiation:() => ShowRunningCommand.showNegotiation,
                                    showCdp:() => ShowRunningCommand.showCdp,
                                    showChannelGroup: () => ShowRunningCommand.createShowChannelGroupDelegate(cmdContext, cmdState)
                                },
                            );
                            cmdState.output = rendered;
                            cmdState.stopProcessing = true;
                        },
                    }]
            },
            { name: "ip", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "ipv6", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "line-num", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "map-class", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "mdns-sd", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "partition", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "policy-map", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "view", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "vlan", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "vnet", description: "", handler: NotSupportedCommand.NotSupported },
            { name: "vrf", description: "", handler: NotSupportedCommand.NotSupported },
        ],
        handler: (cmdContext: CiscoCommandContext, cmdState: CommandState) => {
            if (cmdState.command.parameters[0] || !cmdContext["enabled"] ) {
                cmdState.output = "% Invalid input detected";
                cmdState.stopProcessing = true;
                return cmdState;
            }

            try {
                let rendered: string = Mustache.render(template, {
                    model: cmdContext.device.model,
                    device: cmdContext.device,
                    ports: cmdContext.device.property('interfaces').filter((value: Port) => value instanceof Port).sort((a:Port, b:Port) => a.id - b.id),
                    loopbacks: cmdContext.device.property('interfaces').filter((value: Loopback) => value instanceof Loopback),
                    interfaces: cmdContext.device.property('interfaces').filter((value: GigabitEthernet) => value instanceof GigabitEthernet),
                    showSpanningTree: () => ShowRunningCommand.createShowSpanningTreeDelegate(cmdContext, cmdState),
                    showVtp: function () {
                        return function (text: string, render: any) {
                            let selector = ['vtp', 'mode'];
                            let vtpMode:string = cmdContext.device.property(selector).toLowerCase();
                            if (vtpMode === 'transparent' || vtpMode === 'off')
                                return ShowRunningCommand.showSectionSimple(cmdContext, text, render, selector);
                            else
                                return null;
                        }
                    },
                    showVlans: function () {
                        return (text:string, render:any) => {
                            let data = '';
                            let device = <CiscoDevice>cmdContext.device;
                            let vtpMode = property(device.model).get('vtp.mode');
                            if (vtpMode) {
                                vtpMode = vtpMode.toLowerCase();
                                if (vtpMode === "off" || vtpMode === "transparent") {
                                    let vlans = device.model.vlans.filter((vlan) => 
                                        vlan.name.toLowerCase() !== "default" && 
                                        vlan.status.toLowerCase() === "active").sort((a,b) => a.id - b.id);

                                    let vlanIdsWithDefaultName:number[] = [];
                                    for (let index = 0; index < vlans.length; index++) {
                                        let vlan = vlans[index];
                                        if (vlan.name === "VLAN" + CiscoFormatters.padLeft(vlan.id.toString(), '0000')) {
                                            vlanIdsWithDefaultName.push(vlan.id);
                                        }
                                        else {
                                            if (vlanIdsWithDefaultName.length > 0) {
                                                let normalized = CiscoFormatters.normalizeNumberSet(vlanIdsWithDefaultName);
                                                data += `\nvlan ${normalized}\n!`;
                                                vlanIdsWithDefaultName = [];
                                            }
                                            data += `\nvlan ${vlan.id}\n name ${vlan.name}\n!`;
                                        }
                                    }
                                    if (vlanIdsWithDefaultName.length > 0) {
                                        let normalized = CiscoFormatters.normalizeNumberSet(vlanIdsWithDefaultName);
                                        data += `\nvlan ${normalized}\n!`;
                                    }
                                }
                            }
                            return data;
                        }
                    },
                    showShutdown: () => ShowRunningCommand.createShowShutdownDelegate(cmdContext, cmdState),
                    showSwitchport: () => ShowRunningCommand.createShowSwitchportDelegate(cmdContext, cmdState),
                    showIpAddress:() => ShowRunningCommand.showIpAddress,
                    showNegotiation:() => ShowRunningCommand.showNegotiation,
                    showCdp:() => ShowRunningCommand.showCdp,
                    showChannelGroup: () => ShowRunningCommand.createShowChannelGroupDelegate(cmdContext, cmdState),
                    showDescription:() => ShowRunningCommand.createShowDescriptionDelegate(cmdContext, cmdState),
                });

                cmdState.output = rendered;
                cmdState.stopProcessing = true;
            }
            catch (error) {
                console.log(error)
            }
            return cmdState;
        }
    };

    static showSectionSimple(cmdContext: CiscoCommandContext, text: string, render: any, selector: string | string[]): any {
        let data = '';
        let value = cmdContext.device.property(selector);
        if (value) {
            data = render(text);
        }
        return data;
    }

    static showInterfaceSection(cmdContext: CiscoCommandContext, text: string, render: any, predicate: { (value: any): boolean }) {
        let data = '';
        let name = render('{{{name}}}');
        let foundInterface = cmdContext.device.property('interfaces').find((value: any) =>
            value['name'] === name && predicate(value)
        );
        if (foundInterface) {
            data = render(text);
        }
        return data;
    }

    static createShowChannelGroupDelegate(cmdContext: CiscoCommandContext, cmdState:CommandState) {
        return function(text:string, render:any) {
            let data = '';
            let name = render(text);
            if (name) {
                let foundInterface:GigabitEthernet = ShowRunningCommand.findInterface(cmdContext, name);
                if (foundInterface) {
                    var interfaceChanges:GigabitEthernet = foundInterface.serialize(true);
                    if (Object.keys(interfaceChanges).length > 0) {
                        let channelGroup:ChannelGroup = interfaceChanges.channelGroup;
                        if (channelGroup && channelGroup.id && channelGroup.mode) {
                            data = `\n channel-group ${channelGroup.id} mode ${channelGroup.mode}`;
                        }
                    }
                }
            }
            return data;
        }
    }

    static findInterface(cmdContext:CiscoCommandContext, name:string) {
        let foundInterface = cmdContext.device.property('interfaces').find((value: Interface) =>
        {
            // HACK: Right now this code assumes Loopback and Port-channel has single-digit IDs.
            //       (i.e. Loopback0, Port-channel1, Lo0, Po1, L0, P1, etc)
            //       Eventually this logic needs to change to support more than 10 loopbacks and port-channels.
            let found = 
            (`loopback${name.charAt(name.length-1)}`.startsWith(value.name.toLowerCase().substring(0, value.name.length-2)) && name.charAt(name.length-1) === value.name.charAt(value.name.length-1)) ||
            (`port-channel${name.charAt(name.length-1)}`.startsWith(value.name.toLowerCase().substring(0, value.name.length-2)) && name.charAt(name.length-1) === value.name.charAt(value.name.length-1)) ||
            (`gigabitethernet${name.charAt(name.length-3)}`.startsWith(value.name.toLowerCase().substring(0, value.name.length-4)) && name.toLowerCase().substring(name.length-3) === value.name.toLowerCase().substring(value.name.length-3))
            return found;
        });
        return foundInterface;
    }

    static createShowDescriptionDelegate(cmdContext:CiscoCommandContext, cmdState:CommandState) {
        return function(text:string, render:any) {
            let data = ShowRunningCommand.showInterfaceSection(cmdContext, text, render, (value) => {
                return value['description'] && value['description'] !== "";
            });
            return data;
        }
    }

    static createShowShutdownDelegate(cmdContext:CiscoCommandContext, cmdState:CommandState) {
        return function (text: string, render: any) {
            let data = ShowRunningCommand.showInterfaceSection(cmdContext, text, render, (value) => {
                return value['status'] === "admin down";
            });
            return data;
        }
    }

    static createShowSpanningTreeDelegate(cmdContext:CiscoCommandContext, cmdState:CommandState) {
        return function(text: string, render:any ) {
            let data = '';
            let device = <CiscoDevice>cmdContext.device;
            if (device.model.spanningtree) {
                data += `\nspanning-tree mode ${device.model.spanningtree.mode}`;

                if (property(device.model.spanningtree.portfast).get("edge.default") === true) {
                    data += '\nspanning-tree portfast edge default';
                }

                if (property(device.model.spanningtree.portfast).get("edge.bpduguard.default") === true) {
                    data += '\nspanning-tree portfast edge bpduguard default';
                }

                if (property(device.model.spanningtree.portfast).get("edge.bpdufilter.default") === true) {
                    data += '\nspanning-tree portfast edge bpdufilter default';
                }

                if (property(device.model.spanningtree.portfast).get("network.default") === true) {
                    data += '\nspanning-tree portfast network default';
                }
                
                data += '\nspanning-tree extend system-id';
            }
            if (device.model.vlans) {
                let noSpanningTreeVlanIds:number[] = [];
                let spanningTreeVlanPriorityIds: { [priority: number]: number[]; } = { };
                device.model.vlans/*.filter((vlan) => 
                    vlan.name.toLowerCase() !== "default" && 
                    vlan.status.toLowerCase() === "active")*/.forEach((vlan) => {
                    if (vlan.id && vlan.spanningEnabled === false) {
                        //data += `\nno spanning-tree vlan ${vlanChanges.id}`;
                        noSpanningTreeVlanIds.push(vlan.id);
                    }
                    let vlanChanges:Vlan = vlan.serialize(true);
                    if (Object.keys(vlanChanges).length > 0) {
                        if (vlanChanges.id && vlanChanges.priority) {
                            //data += `\nspanning-tree vlan ${vlanChanges.id} priority ${vlanChanges.priority}`;
                            if (spanningTreeVlanPriorityIds[vlanChanges.priority] === undefined)
                                spanningTreeVlanPriorityIds[vlanChanges.priority] = [];
                            spanningTreeVlanPriorityIds[vlanChanges.priority].push(vlanChanges.id);
                        }
                    }
                });
                if (noSpanningTreeVlanIds.length > 0) {
                    let normalizedSet = CiscoFormatters.normalizeNumberSet(noSpanningTreeVlanIds);
                    data += `\nno spanning-tree vlan ${normalizedSet}`;
                }
                if (Object.keys(spanningTreeVlanPriorityIds).length > 0) {
                    let priorities = Object.keys(spanningTreeVlanPriorityIds).sort((a:any,b:any) => a - b);
                    priorities.forEach((priority) => {
                        let vlanIds = spanningTreeVlanPriorityIds[parseInt(priority)];
                        let normalizedSet = CiscoFormatters.normalizeNumberSet(vlanIds);
                        data += `\nspanning-tree vlan ${normalizedSet} priority ${priority}`;
                    });
                }
            }
            data += '\n!';
            return data;
        }
    }

    static createShowSwitchportDelegate(cmdContext:CiscoCommandContext, cmdState:CommandState) {
        return function (text: string, render: any) {
            let data = '';
            let name = render(text);
            if (name) {
                let foundInterface:GigabitEthernet = ShowRunningCommand.findInterface(cmdContext, name);
                if (foundInterface) {
                    if (foundInterface.switchportMode.toLowerCase() === "disabled") {
                        data += `\n no switchport`;
                    }
                    else {
                        let switchport:Switchport = foundInterface.switchport;
                        if (switchport) {
                            var switchportChanges:Switchport = switchport.serialize(true);
                            if (Object.keys(switchportChanges).length > 0) {                                
                                if (switchportChanges.trunkingVlans) {
                                    let trunkingVlans = CiscoFormatters.denormalizeNumberSet(switchport.trunkingVlans);
                                    let normalizedTrunkingVlans = CiscoFormatters.normalizeNumberSet(trunkingVlans);
                                    if (normalizedTrunkingVlans !== `${CommandConstants.VLAN.min}-${CommandConstants.VLAN.max}`) {
                                        data += `\n switchport trunk allowed vlan ${normalizedTrunkingVlans}`;
                                    }
                                }
                                if (property(switchportChanges).get('adminPrivateVlan.trunkEncapsulation')) {                                 
                                    if (switchportChanges.adminPrivateVlan.trunkEncapsulation.toLowerCase() !== "negotiate") {
                                        data += `\n switchport trunk encapsulation ${switchport.adminPrivateVlan.trunkEncapsulation}`;
                                    }                                    
                                }
                                if (switchportChanges.accessVlan) {
                                    data += `\n switchport access vlan ${switchport.accessVlan}`;
                                }
                                if (switchportChanges.voiceVlan) {
                                    data += `\n switchport voice vlan ${switchport.voiceVlan}`;
                                }
                                if (switchportChanges.adminMode) {
                                    data += `\n switchport mode ${switchport.adminMode.toLowerCase() === 'static access' ? 'access' : switchport.adminMode}`;
                                }
                                if (switchportChanges.trunkNegotiation) {
                                    if (switchportChanges.trunkNegotiation.toLowerCase() === "off") {
                                        data += `\n switchport nonegotiate`;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return data;
        }
    }

    static showIpAddress(text: string, render: any) {
        let data = render(text);

        if (!data || data === " ") {
            data = '\n media-type rj45';
        }
        else {
            data = "\n vrf forwarding Mgmt-intf\n ip address " + data;
        }
        return data;
    }

    static showNegotiation(text:string, render:any ) {
        let negotation = render('{{autoNegotiation}}');
        let data = `\n ${!negotation || negotation.toLowerCase() === "false" ? "no " : ""}negotiation auto`;
        return data;
    }

    static showCdp(text:string, render:any ) {
        let cdp = render('{{cdpEnabled}}');
        let data = '';

        if (!cdp || cdp.toLowerCase() === "false") {
            data = '\n no cdp enabled';
        }
        return data;
    }
}
