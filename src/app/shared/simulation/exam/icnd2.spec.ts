import { Observable } from 'rxjs/Observable';
import { SimulationFactory } from '../simulation.factory';
import { SimICND2 } from './icnd2';
import { CommandResult, CommandResultCode } from '../emulator/interfaces/iemulated-terminal';

import { ExamItemTester } from './tester/examitem-tester';
import { ExamItemSpec, IExamItemStep, IExamItemTask } from './tester/examitem-spec';
import { ExamItemPaths, PathCommand, CalculatePathOptions, IPathPart, IsDistractorPath } from './tester/examitem-path';
import { icnd2SimSpec } from './icnd2-simspec';
import { icnd2ScoreKey } from './icnd2-scorekey';

//export function main() {

  describe('ICND2 Spec - path 0', () => {
    const paths = new ExamItemPaths(icnd2SimSpec, { includeCommandLineForms: true });

    it('Test spec passes validity checks', () => {
        expect(ExamItemSpec.AreTasksValid(icnd2SimSpec)).toBeTruthy();
    });
    it('ICND2 Invoke and Score path 0', () => {
      const sim = SimulationFactory.load(SimICND2);
      const scoreKey = icnd2ScoreKey;
      const result = ExamItemTester.InvokePath(sim, paths, 0, scoreKey);

      let priorTaskDistractor = false;
      for (const taskId in result.taskResults) {
        let expectedPoints = scoreKey[taskId].points; // by default expect all points to be awarded
        if (priorTaskDistractor || IsDistractorPath(result.taskPaths[taskId])) {
          expectedPoints = 0; // no points should be awarded
          priorTaskDistractor = true; // expect no points for all subsequent tasks
        }

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

      for (const taskId in result.taskResults) {
        console.log(`--Task ${taskId} (${result.taskResults[taskId].commands.length} commands)`);
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

      // Check for command errors
      // it('invoked all commands without error'), () => {
        for (const taskId in result.taskResults) {
          for (const command of result.taskResults[taskId].commands) {
            if (command.resultCode !== CommandResultCode.Success) {
              expect(command.resultCode).toEqual(CommandResultCode.Success);
            }
          }
        }
      // });

    });
  });

  xdescribe('ICND2 Spec - All paths', () => {
    const paths = new ExamItemPaths(icnd2SimSpec, { includeCommandLineForms: true });

    it('Test spec passes validity checks', () => {
        expect(ExamItemSpec.AreTasksValid(icnd2SimSpec)).toBeTruthy();
    });
    it('Invoke and Score All Correct and Distractor Paths', () => {
      const pathCount = paths.GetPathCount();
      for (let ordinal = 0; ordinal < pathCount; ordinal++) {
        const sim = SimulationFactory.load(SimICND2);
        const result = ExamItemTester.InvokePath(sim, paths, ordinal, icnd2ScoreKey);
        // TODO: Verify proper scoring

        // TODO: Check for command errors
      }
    });

  });

//}
