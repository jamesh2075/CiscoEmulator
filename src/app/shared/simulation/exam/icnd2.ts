import { SimDefinition, } from '../sim-definition';

import { GigabitEthernet } from "../emulator/cisco/model/gigabitethernet.model";
import { Loopback } from "../emulator/cisco/model/loopback.model";
import { Vlan } from "../emulator/cisco/model/vlan.model";
import { Ethernet } from "../emulator/cisco/model/ethernet.model";
import { Connection } from "../emulator/cisco/model/connection.model";
import { Device } from "../emulator/cisco/model/device.model";
import { ITopology, Topology } from "../emulator/cisco/model/topology.model";

// :: START OF INTERFACES :: //

// :: Switch 1 :: //

let sw1_gi0_0 = new GigabitEthernet();
// sw1_gi0_0.setDefaultValues({
//     priorNo: 99999,
//     address: "My Addr",
//     description: 'My Desc'
// });
sw1_gi0_0.slot = 0;
sw1_gi0_0.port = 0;
sw1_gi0_0.priorNo = 128.1;
sw1_gi0_0.address = 'fa16.2e7f.dc0f';
sw1_gi0_0.switchportMode = "Disabled";
sw1_gi0_0.hardware = "GigabitEthernet";
sw1_gi0_0.internetAddress = "10.255.0.4";
sw1_gi0_0.description = 'OOB management';
sw1_gi0_0.ipv4 = "10.255.0.4";
sw1_gi0_0.ipv4Mask = "255.255.0.0";
sw1_gi0_0.method = 'NVRAM';
sw1_gi0_0.subnet = '16';
sw1_gi0_0.cdpEnabled = 'false';
// debugger;
// sw1_gi0_0.restoreDefaultValues(["priorNo"]);
// debugger;
// sw1_gi0_0.restoreDefaultValues();
// debugger;
// console.log('#diff', sw1_gi0_0.serialize(true));
// debugger;

let sw1_gi0_1 = new GigabitEthernet();
sw1_gi0_1.slot = 0;
sw1_gi0_1.port = 1;
sw1_gi0_1.priorNo = 128.2;
sw1_gi0_1.address = 'fa16.2e61.e523';
sw1_gi0_1.hardware = "iGbE";

let sw1_gi0_2 = new GigabitEthernet();
sw1_gi0_2.slot = 0;
sw1_gi0_2.port = 2;
sw1_gi0_2.priorNo = 128.4;
sw1_gi0_2.address = 'fa16.2ebd.7c1a';
sw1_gi0_2.hardware = "iGbE";

let sw1_gi0_3 = new GigabitEthernet();
sw1_gi0_3.slot = 0;
sw1_gi0_3.port = 3;
sw1_gi0_3.priorNo = 128.4;
sw1_gi0_3.address = 'fa16.2ed7.5933';
sw1_gi0_3.hardware = "iGbE";

let sw1_gi1_0 = new GigabitEthernet();
sw1_gi1_0.slot = 1;
sw1_gi1_0.port = 0;
sw1_gi1_0.priorNo = 128.5;
sw1_gi1_0.address = 'fa16.2ed5.89a2';
sw1_gi1_0.hardware = "iGbE";
sw1_gi1_0.stat = "disconnected";
sw1_gi1_0.description = 'to FS';
sw1_gi1_0.switchport.accessVlan = 10;
sw1_gi1_0.switchport.adminMode = "static access";
sw1_gi1_0.status = 'admin down';
sw1_gi1_0.vlan = 10;
sw1_gi1_0.protocol = "down";
sw1_gi1_0.duplex = "Auto";
sw1_gi1_0.speed = "Auto";


let sw1_gi1_1 = new GigabitEthernet();
sw1_gi1_1.slot = 1;
sw1_gi1_1.port = 1;
sw1_gi1_1.protocol = "down";
sw1_gi1_1.priorNo = 128.6;
sw1_gi1_1.address = 'fa16.2e8b.3021';
sw1_gi1_1.hardware = "iGbE";
sw1_gi1_1.stat = "disconnected";
sw1_gi1_1.description = 'to FS';
sw1_gi1_1.switchport.accessVlan = 10;
sw1_gi1_1.switchport.adminMode = "static access";
sw1_gi1_1.status = 'admin down';
sw1_gi1_1.vlan = 10;
sw1_gi1_1.duplex = "Auto";
sw1_gi1_1.speed = "Auto";


let sw1_gi1_2 = new GigabitEthernet();
sw1_gi1_2.slot = 1;
sw1_gi1_2.port = 2;
sw1_gi1_2.priorNo = 128.7;
sw1_gi1_2.address = 'fa16.2e61.62f5';
sw1_gi1_2.hardware = "iGbE";

let sw1_gi1_3 = new GigabitEthernet();
sw1_gi1_3.slot = 1;
sw1_gi1_3.port = 3;
sw1_gi1_3.priorNo = 128.8;
sw1_gi1_3.address = 'fa16.2e48.23ad';
sw1_gi1_3.hardware = "iGbE";
sw1_gi1_3.trunkEnabled = false;

let sw1_gi2_0 = new GigabitEthernet();
sw1_gi2_0.slot = 2;
sw1_gi2_0.port = 0;
sw1_gi2_0.priorNo = 128.9;
sw1_gi2_0.description = '=== R1 ===';
sw1_gi2_0.address = 'fa16.2e97.ca60';
sw1_gi2_0.hardware = "iGbE";
sw1_gi2_0.trunkEnabled = true;
sw1_gi2_0.switchport.adminTrunkEncapsulation = "dot1q";
sw1_gi2_0.switchport.adminPrivateVlan.trunkEncapsulation = "dot1q";
sw1_gi2_0.switchport.adminMode = "trunk";

let sw1_gi2_1 = new GigabitEthernet();
sw1_gi2_1.slot = 2;
sw1_gi2_1.port = 1;
sw1_gi2_1.priorNo = 128.10;
sw1_gi2_1.address = 'fa16.2e61.3ce8';
sw1_gi2_1.hardware = "iGbE";

let sw1_gi2_2 = new GigabitEthernet();
sw1_gi2_2.slot = 2;
sw1_gi2_2.port = 2;
sw1_gi2_2.priorNo = 128.11;
sw1_gi2_2.address = 'fa16.2e1c.b12a';
sw1_gi2_2.hardware = "iGbE";

let sw1_gi2_3 = new GigabitEthernet();
sw1_gi2_3.slot = 2;
sw1_gi2_3.port = 3;
sw1_gi2_3.priorNo = 128.12;
sw1_gi2_3.address = 'fa16.2e38.de5e';
sw1_gi2_3.hardware = "iGbE";

let sw1_gi3_0 = new GigabitEthernet();
sw1_gi3_0.slot = 3;
sw1_gi3_0.port = 0;
sw1_gi3_0.priorNo = 128.13;
sw1_gi3_0.address = 'fa16.2e98.6b3a';
sw1_gi3_0.hardware = "iGbE";
//sw1_gi3_0.switchport.adminMode = "dynamic auto";
sw1_gi3_0.description = 'to SW2';
sw1_gi3_0.switchport.opMode = "down";
//sw1_gi3_0.switchport.trunkNegotiation = "On";
sw1_gi3_0.status = 'admin down';
sw1_gi3_0.protocol = "down";
sw1_gi3_0.duplex = "Auto";
sw1_gi3_0.speed = "Auto";


let sw1_gi3_1 = new GigabitEthernet();
sw1_gi3_1.slot = 3;
sw1_gi3_1.port = 1;
sw1_gi3_1.priorNo = 128.14;
sw1_gi3_1.address = 'fa16.2e94.6659';
sw1_gi3_1.hardware = "iGbE";
sw1_gi3_1.stat = 'disconnected';
sw1_gi3_1.description = 'to SW2';
//sw1_gi3_1.switchport.adminMode = "dynamic auto";
sw1_gi3_1.switchport.opMode = "down";
//sw1_gi3_1.switchport.trunkNegotiation = "On";
sw1_gi3_1.status = 'admin down';
sw1_gi3_1.protocol = "down";
sw1_gi3_1.duplex = "Auto";
sw1_gi3_1.speed = "Auto";


let sw1_gi3_2 = new GigabitEthernet();
sw1_gi3_2.slot = 3;
sw1_gi3_2.port = 2;
sw1_gi3_2.priorNo = 128.15;
sw1_gi3_2.address = 'fa16.2e92.dc2c';
sw1_gi3_2.hardware = "iGbE";
sw1_gi3_2.stat = 'disconnected';
//sw1_gi3_2.switchport.adminMode = "dynamic auto";
sw1_gi3_2.switchport.opMode = "down";
sw1_gi3_2.switchport.trunkNegotiation = "On";

let sw1_gi3_3 = new GigabitEthernet();
sw1_gi3_3.slot = 3;
sw1_gi3_3.port = 3;
sw1_gi3_3.priorNo = 128.16;
sw1_gi3_3.address = 'fa16.2eed.6c99';
sw1_gi3_3.hardware = "iGbE";
sw1_gi3_3.stat = 'disconnected';
sw1_gi3_3.switchportMode = "Enabled";
//sw1_gi3_3.switchport.adminMode = "dynamic auto";
sw1_gi3_3.switchport.trunkNegotiation = "On";


let sw1_lo_0 = new Loopback();
sw1_lo_0.name = 'Loopback0';
sw1_lo_0.switchportMode = 'Disabled';
sw1_lo_0.description = 'Loopback';
sw1_lo_0.hardware = "Loopback";

let sw1_lo_1 = new Loopback();
sw1_lo_1.name = 'Loopback1';
sw1_lo_1.switchportMode = 'Disabled';
sw1_lo_1.description = 'Loopback';
sw1_lo_1.hardware = "Loopback";

// :: Switch 2 :: //

let sw2_gi0_0 = new GigabitEthernet();
sw2_gi0_0.slot = 0;
sw2_gi0_0.port = 0;
sw2_gi0_0.priorNo = 128.1;
sw2_gi0_0.address = 'fa16.3e7f.dc0f';
sw2_gi0_0.hardware = 'GigabitEthernet';
sw2_gi0_0.internetAddress = '10.255.0.5/16';
sw2_gi0_0.switchportMode = "Disabled";
sw2_gi0_0.description = 'OOB management';
sw2_gi0_0.ipv4 = "10.255.0.5";
sw2_gi0_0.ipv4Mask = "255.255.0.0";
sw2_gi0_0.status = 'up';
sw2_gi0_0.method = 'NVRAM';
sw2_gi0_0.subnet = '16';
// console.log('#diff', gi0_0.serialize(true));
// debugger;

let sw2_gi0_1 = new GigabitEthernet();
sw2_gi0_1.slot = 0;
sw2_gi0_1.port = 1;
sw2_gi0_1.priorNo = 128.2;
sw2_gi0_1.address = 'fa16.3e61.e523';
sw2_gi0_1.hardware = "iGbE";
sw2_gi0_1.description = ' === IOT === ';
sw2_gi0_1.switchport.accessVlan = 40;
sw2_gi0_1.switchport.adminMode = "static access"
sw2_gi0_1.vlan = 40;

let sw2_gi0_2 = new GigabitEthernet();
sw2_gi0_2.slot = 0;
sw2_gi0_2.port = 2;
sw2_gi0_2.priorNo = 128.3;
sw2_gi0_2.address = 'fa16.3ebd.7c1a';
sw2_gi0_2.hardware = "iGbE";
sw2_gi0_2.description = ' === IOT === ';
sw2_gi0_2.switchport.accessVlan = 40;
sw2_gi0_2.switchport.adminMode = "static access"
sw2_gi0_2.vlan = 40;

let sw2_gi0_3 = new GigabitEthernet();
sw2_gi0_3.slot = 0;
sw2_gi0_3.port = 3;
sw2_gi0_3.priorNo = 128.4;
sw2_gi0_3.address = 'fa16.3ed7.5933';
sw2_gi0_3.hardware = "iGbE";

let sw2_gi1_0 = new GigabitEthernet();
sw2_gi1_0.slot = 1;
sw2_gi1_0.port = 0;
sw2_gi1_0.priorNo = 128.5;
sw2_gi1_0.address = 'fa16.3ed5.89a2';
sw2_gi1_0.hardware = "iGbE";
sw2_gi1_0.stat = "disconnected";
sw2_gi1_0.switchport.adminMode = "static access"
sw2_gi1_0.switchport.accessVlan = 10;
sw2_gi1_0.vlan = 10;

let sw2_gi1_1 = new GigabitEthernet();
sw2_gi1_1.slot = 1;
sw2_gi1_1.port = 1;
sw2_gi1_1.protocol = "up";
sw2_gi1_1.priorNo = 128.6;
sw2_gi1_1.address = 'fa16.3e8b.3021';
sw2_gi1_1.hardware = "iGbE";
sw2_gi1_1.stat = "disconnected";
sw2_gi1_1.switchport.adminMode = "static access"
sw2_gi1_1.switchport.accessVlan = 20;
sw2_gi1_1.vlan = 20;

let sw2_gi1_2 = new GigabitEthernet();
sw2_gi1_2.slot = 1;
sw2_gi1_2.port = 2;
sw2_gi1_2.priorNo = 128.7;
sw2_gi1_2.address = 'fa16.3e61.62f5';
sw2_gi1_2.hardware = "iGbE";
sw2_gi1_2.switchport.adminMode = "static access"
sw2_gi1_2.switchport.accessVlan = 30;
sw2_gi1_2.vlan = 30;

let sw2_gi1_3 = new GigabitEthernet();
sw2_gi1_3.slot = 1;
sw2_gi1_3.port = 3;
sw2_gi1_3.priorNo = 128.8;
sw2_gi1_3.address = 'fa16.3e48.23ad';
sw2_gi1_3.hardware = "iGbE";
sw2_gi1_3.trunkEnabled = false;

let sw2_gi2_0 = new GigabitEthernet();
sw2_gi2_0.slot = 2;
sw2_gi2_0.port = 0;
sw2_gi2_0.priorNo = 128.9;
sw2_gi2_0.address = 'fa16.3e97.ca60';
sw2_gi2_0.hardware = "iGbE";
sw2_gi2_0.trunkEnabled = false;

let sw2_gi2_1 = new GigabitEthernet();
sw2_gi2_1.slot = 2;
sw2_gi2_1.port = 1;
sw2_gi2_1.priorNo = 128.10;
sw2_gi2_1.address = 'fa16.3e61.3ce8';
sw2_gi2_1.hardware = "iGbE";

let sw2_gi2_2 = new GigabitEthernet();
sw2_gi2_2.slot = 2;
sw2_gi2_2.port = 2;
sw2_gi2_2.priorNo = 128.11;
sw2_gi2_2.address = 'fa16.3e1c.b12a';
sw2_gi2_2.hardware = "iGbE";

let sw2_gi2_3 = new GigabitEthernet();
sw2_gi2_3.slot = 2;
sw2_gi2_3.port = 3;
sw2_gi2_3.priorNo = 128.12;
sw2_gi2_3.address = 'fa16.3e38.de5e';
sw2_gi2_3.hardware = "iGbE";

let sw2_gi3_0 = new GigabitEthernet();
sw2_gi3_0.slot = 3;
sw2_gi3_0.port = 0;
sw2_gi3_0.priorNo = 128.13;
sw2_gi3_0.address = 'fa16.3e98.6b3a';
sw2_gi3_0.hardware = "iGbE";
sw2_gi3_0.description = 'to SW1';
sw2_gi3_0.status = 'admin down';
sw2_gi3_0.protocol = 'down';
sw2_gi3_0.duplex = "Auto";
sw2_gi3_0.speed = "Auto";

let sw2_gi3_1 = new GigabitEthernet();
sw2_gi3_1.slot = 3;
sw2_gi3_1.port = 1;
sw2_gi3_1.priorNo = 128.14;
sw2_gi3_1.address = 'fa16.3e94.6659';
sw2_gi3_1.hardware = "iGbE";
sw2_gi3_1.stat = 'disconnected';
sw2_gi3_1.description = 'to SW1';
sw2_gi3_1.status = 'admin down';
sw2_gi3_1.protocol = 'down';
sw2_gi3_1.duplex = "Auto";
sw2_gi3_1.speed = "Auto";


let sw2_gi3_2 = new GigabitEthernet();
sw2_gi3_2.slot = 3;
sw2_gi3_2.port = 2;
sw2_gi3_2.priorNo = 128.15;
sw2_gi3_2.address = 'fa16.3e92.dc2c';
sw2_gi3_2.stat = 'disconnected';
sw2_gi3_2.hardware = "iGbE";

let sw2_gi3_3 = new GigabitEthernet();
sw2_gi3_3.slot = 3;
sw2_gi3_3.port = 3;
sw2_gi3_3.priorNo = 128.16;
sw2_gi3_3.address = 'fa16.3eed.6c99';
sw2_gi3_3.stat = 'disconnected';
sw2_gi3_3.hardware = "iGbE";

let sw2_lo_0 = new Loopback();
sw2_lo_0.name = 'Loopback0';
sw2_lo_0.switchportMode = 'Disabled';
sw2_lo_0.description = 'Loopback';
sw2_lo_0.hardware = "Loopback";

let sw2_lo_1 = new Loopback();
sw2_lo_1.name = 'Loopback1';
sw2_lo_1.switchportMode = 'Disabled';
sw2_lo_1.description = 'Loopback';
sw2_lo_1.hardware = "Loopback";

// :: File Server :: //

let fs_gi0_0 = new GigabitEthernet();
fs_gi0_0.slot = 0;
fs_gi0_0.port = 0;
fs_gi0_0.address = 'fa16.3eff.de45';
fs_gi0_0.hardware = 'GigabitEthernet';
fs_gi0_0.internetAddress = '10.255.0.5/16';
fs_gi0_0.switchportMode = "Disabled";
fs_gi0_0.description = 'OOB management';
fs_gi0_0.ipv4 = "10.255.0.5";
fs_gi0_0.ipv4Mask = "255.255.0.0";
fs_gi0_0.status = 'up';
fs_gi0_0.method = 'NVRAM';
fs_gi0_0.subnet = '16';

let fs_gi0_1 = new GigabitEthernet();
fs_gi0_1.slot = 0;
fs_gi0_1.port = 1;
fs_gi0_1.address = 'fa16.3e12.b5f3';
fs_gi0_1.hardware = 'GigabitEthernet';

let fs_gi0_2 = new GigabitEthernet();
fs_gi0_1.slot = 0;
fs_gi0_2.port = 2;
fs_gi0_2.address = 'fa16.3e88.000c';
fs_gi0_2.hardware = 'GigabitEthernet';

let fs_lo_0 = new Loopback();
fs_lo_0.name = 'Loopback0';
fs_lo_0.switchportMode = 'Disabled';
fs_lo_0.description = 'Loopback';
fs_lo_0.hardware = "Loopback";

let R1_gi0_0 = new GigabitEthernet();
R1_gi0_0.slot = 0;
R1_gi0_0.port = 0;
// R1_gi0_0.address = 'fa16.2e7f.dc0f';
R1_gi0_0.hardware = "GigabitEthernet";
// R1_gi0_0.internetAddress = "10.255.0.4";
R1_gi0_0.description = 'OOB management';
// R1_gi0_0.ipv4 = "10.255.0.4";
// R1_gi0_0.ipv4Mask = "255.255.0.0";
// R1_gi0_0.subnet = '16';

let R1_gi0_1 = new GigabitEthernet();
R1_gi0_1.slot = 0;
R1_gi0_1.port = 1;
// R1_gi0_1.address = 'fa16.2e7f.dc0f';
R1_gi0_1.hardware = "GigabitEthernet";
// R1_gi0_1.internetAddress = "10.255.0.4";
R1_gi0_1.description = 'OOB management';
// R1_gi0_1.ipv4 = "10.255.0.4";
// R1_gi0_1.ipv4Mask = "255.255.0.0";
// R1_gi0_1.subnet = '16';

// :: END OF INTERFACES :: //

// :: START OF VLAN :: //    
let SW1_vlan_1 = new Vlan();
SW1_vlan_1.id = 1;
SW1_vlan_1.name = 'default';
SW1_vlan_1.status = "active";
SW1_vlan_1.spanningEnabled = true;
SW1_vlan_1.ports = [sw1_gi0_1.interface, sw1_gi0_2.interface, sw1_gi0_3.interface, sw1_gi1_2.interface, sw1_gi1_3.interface, sw1_gi2_1.interface, sw1_gi2_2.interface, sw1_gi2_3.interface, sw1_gi3_0.interface, sw1_gi3_1.interface, sw1_gi3_2.interface, sw1_gi3_3.interface];
SW1_vlan_1.SAID = "100001";
SW1_vlan_1.type = "enet";
SW1_vlan_1.MTU = "1500";

let SW1_vlan_10 = new Vlan();
SW1_vlan_10.id = 10;
SW1_vlan_10.name = "Servers";
SW1_vlan_10.status = "active";
SW1_vlan_10.spanningEnabled = true;
SW1_vlan_10.ports = [sw1_gi1_0.interface, sw1_gi1_1.interface];
SW1_vlan_10.SAID = "100010";
SW1_vlan_10.type = "enet";
SW1_vlan_10.MTU = "1500";

let SW1_vlan_20 = new Vlan();
SW1_vlan_20.id = 20;
SW1_vlan_20.name = "Clients";
SW1_vlan_20.status = "active";
SW1_vlan_20.spanningEnabled = true;
SW1_vlan_20.SAID = "100020";
SW1_vlan_20.type = "enet";
SW1_vlan_20.MTU = "1500";

let SW1_vlan_30 = new Vlan();
SW1_vlan_30.id = 30;
SW1_vlan_30.name = "Printers";
SW1_vlan_30.status = "active";
SW1_vlan_30.spanningEnabled = true;
SW1_vlan_30.SAID = "100030";
SW1_vlan_30.type = "enet";
SW1_vlan_30.MTU = "1500";

let SW1_vlan_1002 = new Vlan();
SW1_vlan_1002.id = 1002;
SW1_vlan_1002.name = "fddi-default";
SW1_vlan_1002.SAID = "101002";
SW1_vlan_1002.status = "act/unsup";
SW1_vlan_1002.spanningEnabled = true;
SW1_vlan_1002.type = "enet";
SW1_vlan_1002.MTU = "1500";

let SW1_vlan_1003 = new Vlan();
SW1_vlan_1003.id = 1003;
SW1_vlan_1003.name = "token-ring-default";
SW1_vlan_1003.SAID = "101003";
SW1_vlan_1003.status = "act/unsup";
SW1_vlan_1003.spanningEnabled = true;
SW1_vlan_1003.type = "tr";
SW1_vlan_1003.MTU = "1500";

let SW1_vlan_1004 = new Vlan();
SW1_vlan_1004.id = 1004;
SW1_vlan_1004.name = "fddinet-default";
SW1_vlan_1004.SAID = "101004";
SW1_vlan_1004.status = "act/unsup";
SW1_vlan_1004.spanningEnabled = true;
SW1_vlan_1004.Stp = 'ieee';
SW1_vlan_1004.type = "fdnet";
SW1_vlan_1004.MTU = "1500";

let SW1_vlan_1005 = new Vlan();
SW1_vlan_1005.id = 1005;
SW1_vlan_1005.name = "trnet-default";
SW1_vlan_1005.SAID = "101005";
SW1_vlan_1005.status = "act/unsup";
SW1_vlan_1005.spanningEnabled = true;
SW1_vlan_1005.Stp = 'ibm';
SW1_vlan_1005.type = "trnet";
SW1_vlan_1005.MTU = "1500";

// :: Switch 2 :: //
let SW2_vlan_1 = new Vlan();
SW2_vlan_1.id = 1;
SW2_vlan_1.name = 'default';
SW2_vlan_1.spanningEnabled = true;
SW2_vlan_1.ports = [sw2_gi0_3.interface, sw2_gi1_3.interface, sw2_gi2_0.interface, sw2_gi2_1.interface, sw2_gi2_2.interface, sw2_gi2_3.interface, sw2_gi3_0.interface, sw2_gi3_1.interface, sw2_gi3_2.interface, sw2_gi3_3.interface];
SW2_vlan_1.SAID = "100001"
SW2_vlan_1.type = "enet";

let SW2_vlan_10 = new Vlan();
SW2_vlan_10.id = 10;
SW2_vlan_10.name = "VLAN0010";
SW2_vlan_10.status = "active";
SW2_vlan_10.spanningEnabled = true;
SW2_vlan_10.ports = [sw2_gi1_0.interface];
SW2_vlan_10.SAID = "100010";
SW2_vlan_10.type = "enet";

let SW2_vlan_20 = new Vlan();
SW2_vlan_20.id = 20;
SW2_vlan_20.name = "VLAN0020";
SW2_vlan_20.status = "active";
SW2_vlan_20.spanningEnabled = true;
SW2_vlan_20.ports = [sw2_gi1_1.interface];
SW2_vlan_20.SAID = "100020";
SW2_vlan_20.type = "enet";

let SW2_vlan_30 = new Vlan();
SW2_vlan_30.id = 30;
SW2_vlan_30.name = "VLAN0030";
SW2_vlan_30.status = "active";
SW2_vlan_30.spanningEnabled = true;
SW2_vlan_30.ports = [sw2_gi1_2.interface];
SW2_vlan_30.SAID = "100030";
SW2_vlan_30.type = "enet";

let SW2_vlan_40 = new Vlan();
SW2_vlan_40.id = 40;
SW2_vlan_40.name = "VLAN0040";
SW2_vlan_40.status = "active";
SW2_vlan_40.spanningEnabled = true;
SW2_vlan_40.ports = [sw2_gi0_1.interface, sw2_gi0_2.interface];
SW2_vlan_40.ifPorts = [sw2_gi0_1.interface, sw2_gi0_2.interface];
SW2_vlan_40.SAID = "100040";
SW2_vlan_40.type = "enet";

let SW2_vlan_1002 = new Vlan();
SW2_vlan_1002.id = 1002;
SW2_vlan_1002.name = "fddi-default";
SW2_vlan_1002.SAID = "101002";
SW2_vlan_1002.status = "act/unsup";
SW2_vlan_1002.spanningEnabled = true;
SW2_vlan_1002.type = "fddi";

let SW2_vlan_1003 = new Vlan();
SW2_vlan_1003.id = 1003;
SW2_vlan_1003.name = "token-ring-default";
SW2_vlan_1003.SAID = "101003";
SW2_vlan_1003.status = "act/unsup";
SW2_vlan_1003.spanningEnabled = true;
SW2_vlan_1003.type = "tr";

let SW2_vlan_1004 = new Vlan();
SW2_vlan_1004.id = 1004;
SW2_vlan_1004.name = "fddinet-default";
SW2_vlan_1004.ifPorts = [sw2_gi0_1.interface, sw2_gi0_2.interface];
SW2_vlan_1004.SAID = "101004";
SW2_vlan_1004.status = "act/unsup";
SW2_vlan_1004.spanningEnabled = true;
SW2_vlan_1004.Stp = 'ieee';
SW2_vlan_1004.type = "fdnet";

let SW2_vlan_1005 = new Vlan();
SW2_vlan_1005.id = 1005;
SW2_vlan_1005.name = "trnet-default";
SW2_vlan_1005.ifPorts = [sw2_gi0_1.interface, sw2_gi0_2.interface];
SW2_vlan_1005.SAID = "101005";
SW2_vlan_1005.status = "act/unsup";
SW2_vlan_1005.spanningEnabled = true;
SW2_vlan_1005.Stp = 'ibm';
SW2_vlan_1005.type = "trnet";

let FS_vlan_10 = new Vlan();
FS_vlan_10.id = 10;
// FS_vlan_10.name = "Servers";
FS_vlan_10.status = "active";
// FS_vlan_10.spanningEnabled = true;
FS_vlan_10.ports = [ fs_gi0_1.interface, fs_gi0_2.interface ];
FS_vlan_10.SAID = "100010";
FS_vlan_10.type = "enet";
FS_vlan_10.MTU = "1500";

// :: END OF VLAN :: //

// :: START OF DEVICES :: // 
let sw1 = new Device();
sw1.name = "SW1";
sw1.subtype = "IOSvL2";
sw1.address = "fa16.2ec7.4863";
sw1.interfaces = [sw1_gi0_1, sw1_gi0_2, sw1_gi0_3, sw1_gi0_0, sw1_gi1_0, sw1_gi1_1, sw1_gi1_2, sw1_gi1_3, sw1_gi2_0, sw1_gi2_1, sw1_gi2_2, sw1_gi2_3, sw1_gi3_0, sw1_gi3_1, sw1_gi3_2, sw1_gi3_3, sw1_lo_0];
sw1.vlans = [SW1_vlan_1, SW1_vlan_10, SW1_vlan_20, SW1_vlan_30, SW1_vlan_1002, SW1_vlan_1003, SW1_vlan_1004, SW1_vlan_1005];
sw1.vtpConfig = sw1_gi0_0.interface;
sw1.vtp.domain = 'ACME';
sw1.vtp.mode = 'transparent';

let sw2 = new Device();
sw2.name = "SW2";
sw2.subtype = "IOSvL2";
sw2.address = "fa16.3e18.41a2";
sw2.interfaces = [sw2_gi0_1, sw2_gi0_2, sw2_gi0_3, sw2_gi0_0, sw2_gi1_0, sw2_gi1_1, sw2_gi1_2, sw2_gi1_3, sw2_gi2_0, sw2_gi2_1, sw2_gi2_2, sw2_gi2_3, sw2_gi3_0, sw2_gi3_1, sw2_gi3_2, sw2_gi3_3, sw2_lo_0];
sw2.vlans = [SW2_vlan_1, SW2_vlan_10, SW2_vlan_20, SW2_vlan_30, SW2_vlan_40, SW2_vlan_1002, SW2_vlan_1003, SW2_vlan_1004, SW2_vlan_1005];
sw2.vtpConfig = sw2_gi0_0.interface;
sw2.vtp.domain = 'ZENITH';
sw2.vtp.mode = 'server';

let server = new Device();
server.name = "FS";
server.subtype = "IOSvL2";
// server.ipv4 = "192.168.0.4";
server.noTerminal = true;
server.interfaces = [ fs_gi0_0, fs_gi0_1, fs_gi0_2, fs_lo_0 ];
server.vlans = [ FS_vlan_10 ];

let r1 = new Device();
r1.name = "R1";
r1.subtype = "IOSv";
r1.noTerminal = true;
r1.interfaces = [ R1_gi0_0, R1_gi0_1 ];
// :: END OF DEVICES :: //

let devices: Device[] = [sw1, sw2, server, r1];

// create an instance of topology
let topology = new Topology();
topology.name = "ICND2";
topology.devices = devices;
topology.connections = [
    new Connection({ device: 'SW1', iface: 'GigabitEthernet1/0' }, { device: 'FS', iface: 'GigabitEthernet0/1' }),
    new Connection({ device: 'SW1', iface: 'GigabitEthernet1/1' }, { device: 'FS', iface: 'GigabitEthernet0/2' }),
    new Connection({ device: 'SW1', iface: 'GigabitEthernet2/0' }, { device: 'R1', iface: 'GigabitEthernet0/1' }),
    new Connection({ device: 'SW2', iface: 'GigabitEthernet3/0' }, { device: 'SW1', iface: 'GigabitEthernet3/0' }),
    new Connection({ device: 'SW2', iface: 'GigabitEthernet3/1' }, { device: 'SW1', iface: 'GigabitEthernet3/1' })
];

// we are converting it into a json object so we can mimic the real environment
let jsonData: ITopology = topology.serialize(true) as ITopology;

// keeping things the same in this environment
export let SimICND2: SimDefinition = {
    name: jsonData.name,
    devices: jsonData.devices,
    connections: jsonData.connections
};

// debugger;
// let testData:any = {};
// for (let prop in sw1) {
//     if (typeof sw1[prop] !== "function") {
//         console.log('#prop', prop);
//
//         if (prop === '_snapshot') { // BE SURE TO INCLUDE _snapshot
//             testData[prop] = this[prop];
//         }
//         if (prop[0] !== '_') { // DO NOT INCLUDE PROPERTIES THAT START WITH AN UNDERSCORE
//             testData[prop] = this[prop];
//         }
//     } else {
//         console.log('#funcs', prop);
//     }
// }

let data = { topology: jsonData };
console.log('####### COPY BELOW #######');
console.log(JSON.stringify(data));
console.log('####### COPY ABOVE #######');
