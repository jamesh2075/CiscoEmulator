import { Observable } from 'rxjs/Observable';
import { SimulationFactory } from '../../simulation.factory';
import { SimICND2 } from '../icnd2';
import { IEmulatedTerminal, CommandResult, CommandResultCode } from '../../emulator/interfaces/iemulated-terminal';

import { ExamItemTester } from './examitem-tester';
import { ExamItemSpec, IExamItemStep, IExamItemTask, IExamItemTasks } from './examitem-spec';
import { ExamItemPaths, PathCommand, CalculatePathOptions, IPathPart } from './examitem-path';

/**
 * A list of simple commands that can be invoked on a simulation via ExamItemTester
 */
const sampleCommands: PathCommand[] = [{
  label: 'Create channel group',
  devices: 'SW1',
  interfaces: ['gi1/0', 'gi1/1'], // implies 'interface range gi1/0-1'
  commandLine: 'channel-group 1 mode active'
}, {
  label: 'Bring interface up',
  devices: 'SW1',
  interfaces: ['gi1/0', 'gi1/1'], // implies 'interface range gi1/0-1'
  commandLine: 'no shutdown'
}, {
  label: 'Set VTP mode',
  devices: 'SW1',
  interfaces: 'Port-channel 1',
  commandLine: 'switchport access vlan 10'
}];

/**
 * An exam item spec, with each task having as set of commands defined as steps
 */
const sampleExamItemSpec: IExamItemTasks = {
  'A': [{
      label: 'A1',
      devices: 'SW1',
      interfaces: ['gi1/0', 'gi1/1'], // implies 'interface range gi1/0-1'
      steps: [{
          label: 'Create channel group',
          commandLine: 'channel-group 1 mode active',
          distractors: []
        }, {
          label: 'Bring interface up',
          commandLine: 'no shutdown',
          distractors: []
        }, {
          label: 'Verify something',
          commandLine: 'do show interfaces status',
          distractors: []
        }]
    }, {
      label: 'A2',
      devices: 'SW1',
      interfaces: 'Port-channel 1',
      // dependencies: ['A1'],
      selectOneStep: [ // either command can be used, don't invoke both
        { commandLine: 'switchport access vlan 10', distractors: null },
        { commandLine: 'switchport mode access', distractors: null }
      ]
    }
  ],
  'B': {
    devices: 'SW2',
    interfaces: 'Port-channel 1',
    label: 'Set VTP mode',
    steps: {
      commandLine: 'vtp mode transparent',
      distractors: []
    }
  },
  'C': [{
      devices: 'SW1',
      interfaces: ['gi3/0', 'gi3/1'], // implies 'interface range gi3/0-1'
      steps: [{
          label: 'Create channel group 2',
          commandLine: 'channel-group 2 mode desirable',
          distractors: []
        }, {
          commandLine: 'no shutdown',
          distractors: []
        }]
    }, {
      devices: 'SW2',
      interfaces: ['gi3/0', 'gi3/1'], // implies 'interface range gi3/0-1'
      steps: [{
          label: 'Create channel group 2',
          commandLine: 'channel-group 2 mode auto',
          distractors: []
        }, {
          commandLine: 'no shutdown',
          distractors: []
        }]
    }, {
      devices: 'SW1',
      interfaces: ['gi1/0', 'gi1/1'], // implies 'interface range gi1/0-1'
      steps: [{
          label: 'Create channel group',
          commandLine: 'channel-group 1 mode active',
          distractors: []
        }, {
          label: 'Bring interface up',
          commandLine: 'no shutdown',
          distractors: []
      }]
    }
  ]
};

//export function main() {

  // xdescribe('ExamItemTester', () => {
  //   let paths = new ExamItemPaths(sampleSpec, { includeCommandLineForms: true });
  // });

  xdescribe('ExamItemTester usage - exam item spec path sample', () => {
    const paths = new ExamItemPaths(sampleExamItemSpec, { includeCommandLineForms: true });

    it('Invoke path 0', () => {
      const sim = SimulationFactory.load(SimICND2);
      const result = ExamItemTester.InvokePath(sim, paths, 0);

      if (result.taskResults) {
        for (const taskId in result.taskResults) {
          console.log(`Task ${taskId} invoked ${result.taskResults[taskId].commands.length} commands:`);
          for (const command of result.taskResults[taskId].commands) {
            console.log(`${command.device} ${command.interfaces} > ${command.commandLine}`);
            if (command.resultCode !== CommandResultCode.Success) {
              console.log(`Result code: ${command.resultCode}`);
            }
            if (command.output) {
              console.log(command.output);
            }
          }
        }
      }
    });


    xit('Invoke All Correct and Distractor Paths', () => {
      const pathCount = paths.GetPathCount();
      for (let ordinal = 0; ordinal < pathCount; ordinal++) {
        const sim = SimulationFactory.load(SimICND2);
        const result = ExamItemTester.InvokePath(sim, paths, ordinal);

        if (result.taskResults) {
          for (const taskId in result.taskResults) {
            console.log(`${taskId} has ${result.taskResults[taskId].commands.length} command results:`);
            for (const command of result.taskResults[taskId].commands) {
              console.log(`${command.device} ${command.interfaces} > ${command.commandLine}`);
              if (command.resultCode !== CommandResultCode.Success) {
                console.log(`Result code: ${command.resultCode}`);
              }
              if (command.output) {
                console.log(command.output);
              }
            }
          }
        }
      }
    });
  });

  xdescribe('ExamItemTester usage - command list', () => {

    it('Invoke command list', () => {
      const sim = SimulationFactory.load(SimICND2);
      const result = ExamItemTester.InvokeCommands(sim, sampleCommands);

      console.log(`${result.commands.length} command results:`);
      for (const command of result.commands) {
        console.log(`${command.device} ${command.interfaces} > ${command.commandLine}`);
        if (command.resultCode !== CommandResultCode.Success) {
          console.log(`Result code: ${command.resultCode}`);
        }
        if (command.output) {
          console.log(command.output);
        }
      }
    });

  });

//}

