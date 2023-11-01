import { it } from '@angular/cli/lib/ast-tools/spec-utils';
// import * as console from 'console';

import { SimulationFactory } from '../../simulation.factory';
import { SimICND2 } from '../../exam/icnd2';
import { PathCommand, ExamItemPaths } from '../../exam/tester/examitem-path';
import { ExamItemTester } from '../../exam/tester/examitem-tester';
import { Simulation } from '../../simulation';
import { ICiscoDevice, ICiscoInterface } from './icisco-device';
import { CommandResultCode } from '../interfaces/iemulated-terminal';
import {
  ChannelGroupActionModel,
  CiscoAction,
  CiscoCommandAction,
  CiscoCommandActions,
  ICiscoCommandActions,
  NoShutdownActionModel,
  PortChannelActionModel,
} from './cisco-command-actions';
import { ExamItemScoreKey } from '../../exam/score/scorekey';
import { IExamItemTasks } from '../../exam/tester/examitem-spec';

//export function main() {
  // xdescribe('CiscoCommandActions', () => {
  //   xit('system test: "no shutdown" updates status', () => {
  //     let sim = SimulationFactory.load(SimICND2);

  //     let sw1 = sim.getDevice('SW1');
  //     let sw2 = sim.getDevice('SW2');
  //     let interfaces = [
  //       sw1.getInterface('gi3/0'),
  //       sw1.getInterface('gi3/1'),
  //       sw2.getInterface('gi3/0'),
  //       sw2.getInterface('gi3/1')
  //     ];

  //     // prior to invoking commands, gi3/0-1 should not be up on both devices
  //     for(let iface of interfaces) {
  //       let protocol = (iface.model.status === 'up') ? 'up' : (<any>iface.model).protocol;
  //       expect(iface.model.status).not.toEqual('up');
  //       expect(protocol).not.toEqual('up');
  //       console.log(`${iface.model.name} ${iface.model.status} ${protocol}`)
  //     }

  //     let result = ExamItemTester.InvokeCommands(sim, etherChannelCase3);

  //     for(let iface of interfaces) {
  //       let protocol = (iface.model.status === 'up') ? 'up' : (<any>iface.model).protocol;
  //       expect(iface.model.status).toEqual('up');
  //       expect(protocol).toEqual('up');
  //       let model = iface.model as any;
  //       console.log(`${model.$class}${model.slot}/${model.port} ${model.status} ${protocol}`);
  //     }

  //   });

  // });
//}


  // Basic test case where bundling doesn't happen

  /*
   1. Create a port channel 1 on SW1 and bundle gi1/0-1 under Port channel 1
      // Bundles as they have same local configuration
      // 1. Status for Gi1/0 and Gi1/1 should be down(D) ready for connection
         2. Status for port-channel is (SD) as none of the conditions match  (local && remote)
   2. Create a port channel 1 on SW2 and bundle gi1/0-1 under Port channel 1
      // Creates a port channel
      // Bundling cannot be done and displays this message
         1. Cannot Bundle : Gi1/1 is not compatible with Gi1/0 and will be suspended (access vlan of Gi1/1 is 20, Gi1/0 is 10)
         2. Cannot Bundle : Gi1/0 suspended : LACP currently not enabled on the remote port
         3. Status for Gi1/0 and Gi1/1 should be suspended(s) as they are not compatible to become a member
         4. Status for port-channel is (SD) as none of the conditions match  (local && remote)
 */


  const etherChannelCase1: PathCommand[] = [{
    label: 'Create channel group',
    devices: 'SW1',
    interfaces: ['gi1/0', 'gi1/1'], // implies 'interface range gi1/0-1'
    commandLine: 'channel-group 1 mode active'
  }, {
    label: 'Create channel group',
    devices: 'SW2',
    interfaces: ['gi1/0', 'gi1/1'], // implies 'interface range gi1/0-1'
    commandLine: 'channel-group 1 mode active'
  }];



  // Basic commands for above case to make bundling happen
  // Change switchport access vlan for interface gi1/0 on SW2 to 10. As all conditions match bundling will happen

  const etherChannelCase2: PathCommand[] = [{
    label: 'Create channel group',
    devices: 'SW1',
    interfaces: ['gi1/0', 'gi1/1'], // implies 'interface range gi1/0-1'
    commandLine: 'channel-group 1 mode active'
  }, {
    label: 'Create channel group',
    devices: 'SW2',
    interfaces: ['gi1/0', 'gi1/1'], // implies 'interface range gi1/0-1'
    commandLine: 'channel-group 1 mode active'
  },
  {
    label: 'change switchport access vlan ',
    devices: 'SW2',
    interfaces: ['gi1/0', 'gi1/1'], // implies 'interface range gi1/0-1'
    commandLine: 'sw acc vlan 10'
  },
  ];


  /*
   1. Create a port channel 2 on SW1 and bundle gi3/0-1 under Port channel 2
      // Bundles as they have same local configuration

   2. Create a port channel 2 on SW2 and bundle gi3/0-1 under Port channel 2
      // Creates a port channel
      // Bundling is done as local and remote conditions match
 */

  const etherChannelCase3: PathCommand[] = [
  {
    label: 'Verification',
    devices: ['SW1', 'SW2'],
    interfaces: null,
    commandLine: 'do show interfaces description'
  }, {
    label: 'Create channel group',
    devices: 'SW1',
    interfaces: ['gi3/0', 'gi3/1'],
    commandLine: 'channel-group 2 mode desirable'
  },
  {
    label: '',
    devices: 'SW1',
    interfaces: ['gi3/0', 'gi3/1'], // changes state to up
    commandLine: 'no shutdown'
  },
  {
    label: 'Create channel group',
    devices: 'SW2',
    interfaces: ['gi3/0', 'gi3/1'], // implies 'interface range gi1/0-1'
    commandLine: 'channel-group 2 mode auto' // Assuming the status for these interfaces is 'up'
  },
  {
    label: '',
    devices: 'SW2',
    interfaces: ['gi3/0', 'gi3/1'], // changes state to up
    commandLine: 'no shutdown'
  },
  {
    label: 'Verification',
    devices: ['SW1', 'SW2'],
    interfaces: null,
    commandLine: 'do show interfaces description'
  } ];
// do show interfaces description
// SW1: gi3/0-1 status should be 'up' 'up' to SW2
// SW2: gi3/0-1 status should be 'up' 'up' to SW1

