import {CiscoCommandContext} from "../cisco-terminal-command";
import {CommandState} from "../../interfaces/command-state";
import {CommandConstants} from "../common/cisco-constants";
export interface ICommandHandler {
}

export class CommandHandler implements ICommandHandler {

}

export class NotSupportedCommand extends CommandHandler {
    static NotSupported(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.output = CommandConstants.ERROR_MESSAGES.UNSUPPORTED_COMMAND;
        cmdState.stopProcessing = true;
        return cmdState;
    }
     static NotImplemented(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.output = CommandConstants.ERROR_MESSAGES.UNIMPLEMENTED_COMMAND;
        cmdState.stopProcessing = true;
        return cmdState;
    }
}

// TODO: This is old and will no longer be used, use above instead
// export class CommandsNotSupported {
//   static commandList = `
// access-enable,access-profile,clear,connect,crypto,disable,disconnect,do-exec,enable,
// Gigabitethernet,help,lat,lock,login,logout,mrinfo,mstat,mtrace,name-connection,pad,
// ping,ppp,release,renew,resume,rlogin,routing-context,set,show,slip,ssh,systat,tclquit,
// telnet,terminal,tn3270,traceroute,tunnel,udptn,where,x28,x3,xremote,access-enable,
// access-profile,access-template,alps,archive,authentication,beep,bfe,calendar,cd,clear,
// clock,cns,configure,connect,copy,crypto,debug,delete,dir,disable,disconnect,do-exec,
// dot1x,eap,enable,erase,Gigabitethernet,event,format,fsck,help,if-mgr,ip,lat,lock,
// logging,login,logout,macro,mediatrace,mkdir,monitor,more,mpls,mrinfo,mrm,mstat,mtrace,
// name-connection,ncia,no,onep,pad,ping,port-channel,ppp,pwd,release,reload,rename,renew,
// restart,resume,rlogin,rmdir,routing-context,rsh,sdlc,send,set,setup,show,slip,software,
// software,spec-file,ssh,start-chat,systat,tarp,tclquit,tclsh,telnet,terminal,test,tn3270,
// traceroute,tunnel,udld,udptn,undebug,upgrade,verify,vtp,where,which-route,write,x28,x3,
// xremote,aaa,access-list,access-session,alias,alps,ancp,apollo,appletalk,arap,archive,
// arp,async-bootp,authentication,auto,autoconf,banner,beep,bfd,bfd-template,boot,bridge,
// bridge-domain,bstun,buffers,busy-message,captive-portal-bypass,cdp,cef,chat-script,
// class-map,clns,clock,cns,configuration,connect,control-plane,crypto,decnet,default,
// default-value,define,device-sensor,dialer,dialer-list,dlsw,dnsix-dmdp,dnsix-nat,do-exec,
// dot1x,downward-compatible-config,dspu,eap,enable,end,energywise,epm,errdisable,
// Gigabitethernet,event,exception,exit,fallback,fhrp,file,flow,flow-sampler-map,format,
// frame-relay,global-address-family,help,hostname,hw-module,id-manager,identity,interface,
// p,ipc,ipv6,isis,kerberos,key,keymap,kron,l2,l2protocol-tunnel,l2tp,l2tp-class,lacp,lat,
// li-view,line,lldp,lnm,locaddr-priority-list,location,logging,login,login-string,mab,mac,
// macro,map-class,map-list,mediatrace,memory,memory-size,menu,metadata,modemcap,monitor,
// mpls,multilink,ncia,netbios,netconf,nmsp,no,ntp,object-group,onep,parameter-map,parser,
// partition,passthru-domain-list,password,pnp,policy-map,port-channel,port-security,
// priority-list,privilege,process,process-max-time,prompt,pseudowire-class,qos,queue-list,
// egexp,resource,resume-string,rif,rlogin,route-map,route-tag,router,rsrb,sampler,
// sap-priority-list,sasl,scheduler,scripting,service,service-instance,service-list,
// service-policy,service-routing,service-routing,service-template,shell,shutdown,smrp,sna,
// snmp,snmp-server,source,source-bridge,spanning-tree,stacks,standby,state-machine,stun,
// subscriber-policy,table-map,tacacs-server,tarp,template,terminal-queue,tftp-server,
// time-range,tn3270,track,translate,ttycap,ttyscan,udld,user-name,username,vines,
// virtual-profile,virtual-template,vlan,vrf,vtp,vty-async,wsma,x25,x29,xremote,aaa,
// access-expression,access-session,apollo,arp,backup,bandwidth,bfd,bgp-policy,carrier-delay,
// cdp,channel-group,channel-protocol,cmns,crypto,custom-queue-list,dampening,decnet,default,
// delay,description,dlsw,dot1q,dspu,duplex,Gigabitethernet,fair-queue,flow-sampler,
// flowcontrol,fras,help,history,hold-queue,ip,ipv6,isis,iso-igrp,keepalive,l2protocol,
// l2protocol-tunnel,lacp,lan-name,lat,link,llc2,lldp,load-interval,locaddr-priority,
// location,logging,loopback,mac,mac-address,macro,media-type,metadata,mpls,mtu,negotiation,
// netbios,nmsp,no,onep,pagp,priority-group,random-detect,rate-limit,routing,sap-priority,
// service,service-policy,shutdown,smrp,sna,snapshot,snmp,source,speed,subscriber,switchport,
// tarp,timeout,topology,traffic-shape,transmit-interface,tx-ring-limit,udld,vines,vtp,xconnect
// `;
//   static getCommands() : {[key:string]: ICommandHandler} {
//     let result : {[key:string]: ICommandHandler} = {};
//     let split = CommandsNotSupported.commandList.split(',\r\n');
//     for(let cmd of split){
//       result[cmd] = new NotSupportedCommand();
//     }
//     return result;
//   }
// }
