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
import { SimICND2 } from "../../../../exam/icnd2";

// TODO: Figure out a way to have mustache NOT render blank lines when no data is available.
//       Then we can show {{placeholders}} within the template in a more intuitive way.

let template: string = `Building configuration...

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
{{#loopbacks}}interface {{#decode}}{{name}}{{/decode}}{{#showDescription}}\n description {{#decode}}{{description}}{{/decode}}{{/showDescription}}
 no ip address
{{/loopbacks}}!
{{#ports}}interface {{#decode}}{{name}}{{/decode}}{{#showDescription}}\n description {{#decode}}{{description}}{{/decode}}{{/showDescription}}{{#showSwitchport}}{{#decode}}{{name}}{{/decode}}{{/showSwitchport}}{{#showShutdown}}\n shutdown{{/showShutdown}}\n!
{{/ports}}
{{#interfaces}}interface {{#decode}}{{name}}{{/decode}}{{#showDescription}}\n description {{#decode}}{{description}}{{/decode}}{{/showDescription}}{{#showSwitchport}}{{#decode}}{{name}}{{/decode}}{{/showSwitchport}}{{#showShutdown}}\n shutdown{{/showShutdown}}{{#showIpAddress}}{{ipv4}} {{ipv4Mask}}{{/showIpAddress}}{{#showChannelGroup}}{{#decode}}{{name}}{{/decode}}{{/showChannelGroup}}
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

export class ShowStartupCommand {
    static command: TerminalCommand = {
        name: "starting-config",
        description: 'Current operating configuration',
        parameters: [],
        children: [
            { name: "line-num", description: "Display line numbers in ouput", handler: NotSupportedCommand.NotSupported },
            { name: "|", description: "Output modifiers", handler: NotSupportedCommand.NotSupported },
            { name: "<cr>", description: "", handler: NotSupportedCommand.NotSupported },
        ],
        handler: (cmdContext: CiscoCommandContext, cmdState: CommandState) => {
            // The commented code below fixes bug 740.
            // Keith is working on a separate bug related to cmdContext.confInterface
            // if (cmdState.command.parameters[0] || !cmdContext["enabled"] || cmdContext.confInterface )
            if (cmdState.command.parameters[0] || !cmdContext["enabled"] ) {
                cmdState.output = "% Invalid input detected";
                cmdState.stopProcessing = true;
                return cmdState;
            }

            try {
                let rendered: string = Mustache.render(template, {
                    model: cmdContext.device.model,
                    device: cmdContext.device,
                    ports: cmdContext.device.property('interfaces').filter((value: Port) => value instanceof Port),
                    loopbacks: cmdContext.device.property('interfaces').filter((value: Loopback) => value instanceof Loopback),
                    interfaces: cmdContext.device.property('interfaces').filter((value: GigabitEthernet) => value instanceof GigabitEthernet),
                    decode: () => ShowStartupCommand.decode,
                    showSpanningTree: () => ShowStartupCommand.createShowSpanningTreeDelegate(cmdContext, cmdState),
                    showVtp: function () {
                        return function (text: string, render: any) {
                            let selector = ['vtp', 'mode'];
                            let vtpMode:string = cmdContext.device.property(selector).toLowerCase();
                            if (vtpMode === 'transparent' || vtpMode === 'off')
                                return ShowStartupCommand.showSectionSimple(cmdContext, text, render, selector);
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
                                        vlan.status.toLowerCase() === "active");
                                    if (vlans.length <= 3) {
                                        vlans.forEach(vlan => {
                                            data += `\nvlan ${vlan.id}\n name ${vlan.name}\n!`;
                                        });
                                    }
                                    else {
                                        let index = 0;
                                        data += `\nvlan ${vlans[index].id}`;
                                        while (++index < vlans.length)
                                            data += `,${vlans[index].id}`;
                                        data += '\n!';
                                    }
                                }
                            }
                            return data;
                        }
                    },
                    showShutdown: () => ShowStartupCommand.createShowShutdownDelegate(cmdContext, cmdState),
                    showSwitchport: () => ShowStartupCommand.createShowSwitchportDelegate(cmdContext, cmdState),
                    showIpAddress:() => ShowStartupCommand.showIpAddress,
                    showChannelGroup: () => ShowStartupCommand.createShowChannelGroupDelegate(cmdContext, cmdState),
                    showDescription:() => ShowStartupCommand.createShowDescriptionDelegate(cmdContext, cmdState),
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
        let name = render('{{#decode}}{{name}}{{/decode}}');
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
                let foundInterface:GigabitEthernet = ShowStartupCommand.findInterface(cmdContext, name);
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
            let found = 
            value.name.toLowerCase() === name.toLowerCase() ||
            value.interface.toLowerCase() === name.toLowerCase() ||
            (name.toLowerCase().startsWith('po') && value.name.toLowerCase() === `port-channel${name.substring(2)}`);
            return found;
        });
        return foundInterface;
    }

    static createShowDescriptionDelegate(cmdContext:CiscoCommandContext, cmdState:CommandState) {
        return function(text:string, render:any) {
            let data = ShowStartupCommand.showInterfaceSection(cmdContext, text, render, (value) => {
                return value['description'] && value['description'] !== "";
            });
            return data;
        }
    }

    static createShowShutdownDelegate(cmdContext:CiscoCommandContext, cmdState:CommandState) {
        return function (text: string, render: any) {
            let data = ShowStartupCommand.showInterfaceSection(cmdContext, text, render, (value) => {
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
                data += `\nspanning-tree mode ${device.model.spanningtree.mode}\n spanning-tree extend system-id`;
            }
            if (device.model.vlans) {
                device.model.vlans.filter((vlan) => 
                    vlan.name.toLowerCase() !== "default" && 
                    vlan.status.toLowerCase() === "active").forEach((vlan) => {
                    let vlanChanges:Vlan = vlan.serialize(true);
                    if (Object.keys(vlanChanges).length > 0) {
                        if (vlanChanges.id && !vlanChanges.spanningEnabled) {
                            data += `\nno spanning-tree vlan ${vlanChanges.id}`;
                        }
                        if (vlanChanges.id && vlanChanges.priority) {
                            data += `\nspanning-tree vlan ${vlanChanges.id} priority ${vlanChanges.priority}`;
                        }
                    }
                })
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
                let foundInterface:GigabitEthernet = ShowStartupCommand.findInterface(cmdContext, name);
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
                                    data += `\n switchport trunk allowed vlan ${switchport.trunkingVlans}`;
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
            data = '\n media-type rj45\n negotiation auto';
        }
        else {
            data = "\n vrf forwarding Mgmt-intf\n ip address " + data + "\n negotiation auto\n no cdp enable";
        }
        return data;
    }

    // TODO: Use a common HTML decoder instead of this custom implementation
    static decode(text:string, render:any) {
        let decodedText = render(text)
            .replace(new RegExp('&#x2F;', 'g'), '/')
            .replace(new RegExp("&#x3D;", 'g'), '=');
        return decodedText;
    }
}
