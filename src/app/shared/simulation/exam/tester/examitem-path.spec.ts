import { Observable } from 'rxjs/Observable';
import { SimulationFactory } from '../../simulation.factory';
import { SimICND2 } from '../icnd2';

import { ExamItemTester } from './examitem-tester';
import { ExamItemSpec, IExamItemStep, IExamItemTask } from './examitem-spec';
import { ExamItemPaths, PathCommand, CalculatePathOptions, IPathPart } from './examitem-path';
import { icnd2SimSpec } from '../icnd2-simspec';
import { icnd2ScoreKey } from '../icnd2-scorekey';

export function main() {

  xdescribe('ExamItemPaths', () => {
    const paths = new ExamItemPaths(icnd2SimSpec, { includeCommandLineForms: true });

    it('Builds scenario paths', () => {
      console.log('Total paths:' + paths.GetPathCount);
      for (const taskId in icnd2SimSpec) {
        console.log('Task ' + taskId);
        expect(paths.taskPathParts[taskId]).toBeDefined();
        expect(paths.taskPaths[taskId]).toBeDefined();

        const pathParts = (Array.isArray(paths.taskPathParts[taskId]) ?
                        paths.taskPathParts[taskId] :
                        [paths.taskPathParts[taskId]] ) as IPathPart[];
        for (const path of pathParts) {
          console.log(`\tcorrect: ${path.correct.length}, incorrect: ${path.incorrect.length}`);
        }
        const taskPaths = paths.taskPaths[taskId];
        for (let index = 0; index < taskPaths.length; index++) {
          console.log('\t' + JSON.stringify(taskPaths[index]));
        }
      }
    });
    it('A path can be selected by ordinal', () => {
      const pathCount = paths.GetPathCount();
      console.log('Total paths:' + pathCount);

      const paths0 = paths.GetTaskPathIndexByOrdinal(0);
      expect(paths0).toBeTruthy();
      const pathsMax = paths.GetTaskPathIndexByOrdinal(pathCount - 1);
      expect(pathsMax).toBeTruthy();
      const pathsMaxPlusOne = paths.GetTaskPathIndexByOrdinal(pathCount);
      expect(pathsMaxPlusOne).toBeTruthy();
      expect(JSON.stringify(pathsMaxPlusOne)).toEqual(JSON.stringify(paths0));
    });
    it('Builds command lists for paths', () => {
      const result = paths.GetPathCommandsByTaskPathIndex({});
      for (const taskId in result) {
        console.log('Task ' + taskId);
        const commands = result[taskId];
        for (const command of commands) {
          console.log(`\td:${JSON.stringify(command.devices)} i:${JSON.stringify(command.interfaces)} -> ${command.commandLine}`);
        }
      }
    });
  });

}
