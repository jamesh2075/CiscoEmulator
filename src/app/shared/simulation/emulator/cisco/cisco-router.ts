import {IRouter} from '../interfaces/irouter';
import {CiscoDevice} from './cisco-device';
import {SimDevice, SimDeviceType, SimCommandData} from '../../sim-definition';

// export class UndefinedCommand extends CommandHandler {
// }

export class CiscoRouter extends CiscoDevice implements IRouter {
}

// export class CiscoRouter implements IRouter {
//   name: string;
//   ip: string;

//   // userCommands = {
//   //   'access-enable': new UndefinedCommand,
//   //   'access-profile': new UndefinedCommand,
//   //   'clear': new UndefinedCommand,
//   //   'connect': new UndefinedCommand,
//   //   'crypto': new UndefinedCommand,
//   //   'disable': new UndefinedCommand,
//   //   'disconnect': new UndefinedCommand,
//   //   'do-exec': new UndefinedCommand,
//   //   'enable': new UndefinedCommand,
//   //   'ethernet': new UndefinedCommand,
//   //   'exit': new UndefinedCommand,
//   //   'help': new UndefinedCommand,
//   //   'lat': new UndefinedCommand,
//   //   'lock': new UndefinedCommand,
//   //   'login': new UndefinedCommand,
//   //   'logout': new UndefinedCommand,
//   //   'mrinfo': new UndefinedCommand,
//   //   'mstat': new UndefinedCommand,
//   //   'mtrace': new UndefinedCommand,
//   //   'name-connection': new UndefinedCommand,
//   //   'pad': new UndefinedCommand,
//   //   'ping': new UndefinedCommand,
//   //   'ppp': new UndefinedCommand,
//   //   'release': new UndefinedCommand,
//   //   'renew': new UndefinedCommand,
//   //   'resume': new UndefinedCommand,
//   //   'rlogin': new UndefinedCommand,
//   //   'routing-context': new UndefinedCommand,
//   //   'set': new UndefinedCommand,
//   //   'show': new UndefinedCommand,
//   //   'slip': new UndefinedCommand,
//   //   'ssh': new UndefinedCommand,
//   //   'systat': new UndefinedCommand,
//   //   'tclquit': new UndefinedCommand,
//   //   'telnet': new UndefinedCommand,
//   //   'terminal': new UndefinedCommand,
//   //   'tn3270': new UndefinedCommand,
//   //   'traceroute': new UndefinedCommand,
//   //   'tunnel': new UndefinedCommand,
//   //   'udptn': new UndefinedCommand,
//   //   'where': new UndefinedCommand,
//   //   'x28': new UndefinedCommand,
//   //   'x3': new UndefinedCommand,
//   //   'xremote': new UndefinedCommand
//   // };

//   privilegedCommands = {
// // access-enable,
// // access-profile,
// // access-template,
// // alps,
// // archive,
// // authentication,
// // beep,
// // bfe,
// // calendar,
// // cd,
// // clear,
// // clock,
// // cn,
// // configure,
// // connect,
// // copy,
// // crypto,
// // debug,
// // delete,
// // dir,
// // disable,
// // disconnect,
// // do-exec,
// // dot1x,
// // eap,
// // enable,
// // erase,
// // ethernet,
// // eent,
// // exit,
// // format,
// // fsck,
// // help,
// // if-mgr,
// // ip,
// // at,
// // lock,
// // logging,
// // login,
// // logout,
// // macro,
// // mediatrace,
// // mkdir,
// // monitor,
// // more,
// // mpls,
// // mrinfo,
// // routemrm,
// // mstat,
// // mtrace,
// // name-connection,
// // ncia,
// // no,
// // onep,
// // pad,
// // ping,
// // port-channel,
// // ppp,
// // pwd,
// // release,
// // reload,
// // rename,
// // renew,
// // restrt,
// // resume,
// // rlogin,
// // rmdir,
// // routing-context,
// // rsh,
// // sdlc,
// // send,
// // set,
// // setup,
// // show,
// // slip,
// // software,
// // software,
// // spec-file,
// // ssh,
// // stat-chat,
// // systat,
// // terminal,
// // udld,
// // udptn,
// // undebug,
// // upgrade,
// // veify,
// // vtp,
// // where,
// // which-route,
// // write,
// // x28,
// // x3,
// // xconnect,
// // xremote,
// // running-config,
// // startup-config,
// // interface,
// // etherchannel,
// // vlan,
// // spanning-tree,
// // summary,
// // configure,
// // status,
// // address-table,
// // database
//   };

//   globalCommands = {
//   };

//   interfaceCommands = {
//   };

//   notSupportedCommands = {
//   };

//   constructor(settings: SimDevice = null) {
//     if(settings) {
//       this.name = settings.name;
//       this.ip = settings.ip;
//     }
//   }

// }
