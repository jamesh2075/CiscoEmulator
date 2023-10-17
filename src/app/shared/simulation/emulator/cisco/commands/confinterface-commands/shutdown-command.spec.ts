import { CommandTestCase, CommandTester } from '../command-tester';
import { ShutdownCommand } from './shutdown-command';
import {
  CiscoAction,
  CiscoCommandAction,
  ICiscoCommandActions,
  PortChannelActionModel,
  ChannelGroupActionModel,
  NoShutdownActionModel
} from '../../cisco-command-actions';
import { ExamItemScoreKey } from '../../../../exam/score/scorekey';
import { IExamItemTasks } from '../../../../exam/tester/examitem-spec';
import { ExamItemPaths } from '../../../../exam/tester/examitem-path';
import { SimulationFactory } from '../../../../simulation.factory';
import { SimICND2 } from '../../../../exam/icnd2';
import { ExamItemTester } from '../../../../exam/tester/examitem-tester';

export function main() {
  const noShutdownTasks: IExamItemTasks = {
    'A': {
      devices: 'SW1',
      interfaces: ['gi3/0', 'gi3/1'],
      steps: {
        label: 'Create channel group',
        commandLine: 'channel-group 2 mode desirable',
      }
    },
    'B': {
      devices: 'SW1',
      interfaces: ['gi3/0', 'gi3/1'],
      steps: {
        commandLine: 'no shutdown',
      }
    },
    'C': {
      devices: 'SW2',
      interfaces: ['gi3/0', 'gi3/1'],
      steps: {
        label: 'Create channel group',
        commandLine: 'channel-group 2 mode auto',
      }
    },
    'D': {
      devices: 'SW2',
      interfaces: ['gi3/0', 'gi3/1'],
      steps: {
        commandLine: 'no shutdown',
      }
    }
  };

  const noShutdownScoreKey: ExamItemScoreKey = {
    'A': {
      points: 1,
      verify: {
        devices: 'SW1',
        interfaces: ['gi3/0', 'gi3/1'],
        verify: { 'interface status': 'admin down' }
      }
    },
    'B': {
      points: 1,
      verify: {
        devices: 'SW1',
        interfaces: ['gi3/0', 'gi3/1'],
        verify: { 'interface status': 'down' }
      }
    },
    'C': {
      points: 1,
      verify: {
        devices: 'SW2',
        interfaces: ['gi3/0', 'gi3/1'],
        verify: { 'interface status': 'admin down' }
      }
    },
    'D': {
      points: 1,
      verify: {
        devices: ['SW1', 'SW2'],
        interfaces: ['gi3/0', 'gi3/1'],
        verify: { 'interface status': 'up' }
      }
    }
  };

  const testCases: CommandTestCase[] = [
    {
      commands: 'shutdown',
      model: { 'status': 'admin down' }

    }
  ];

  const noTestCases: CommandTestCase[] = [
    {
      commands: 'no shutdown',
      model: { 'status': 'up' }
    },
    {
      commands: 'no shutdown',
      // model: { 'status': 'up' },
      actions: { actionId: CiscoAction.NoShutdown, model: { interfaces: [] } }
    }
  ];

  xdescribe('no shutdown', () => {
    CommandTester.RunTestCases(testCases, ShutdownCommand.shutdownCommand);
  });
  describe('system test: no shutdown', () => {
    it('correctly updates status according to connected peer state', () => {
      const paths = new ExamItemPaths(noShutdownTasks);
      const sim = SimulationFactory.load(SimICND2);
      const result = ExamItemTester.InvokePath(sim, paths, 0, noShutdownScoreKey);

      for (const taskId in result.taskResults) {
        const expectedPoints = noShutdownScoreKey[taskId].points; // by default expect all points to be awarded

        // log detail to the console if points not as expected
        if (result.taskResults[taskId].score.points !== expectedPoints) {
          console.log(`${taskId} awarded ${result.taskResults[taskId].score.points} points instead of ${expectedPoints} as expected`);
          for (const verification of result.taskResults[taskId].score.verifications) {
            console.log(`${verification.pass ? '+Pass:' : '-Fail'} [${verification.device}][${verification.iface}] ${verification.name}\n` +
              `\tmodel: ${JSON.stringify(verification.model)}\n\texpected: ${JSON.stringify(verification.expected)}`);
          }
        }

        expect(result.taskResults[taskId].score.points).toEqual(expectedPoints);
      }
    });
  });
  xdescribe('shutdown', () => {
    CommandTester.RunTestCases(noTestCases, ShutdownCommand.noShutdown);
  });
}
