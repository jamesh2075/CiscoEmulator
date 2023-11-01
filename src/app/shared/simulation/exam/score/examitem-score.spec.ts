import { Observable } from 'rxjs/Observable';
import { SimulationFactory } from '../../simulation.factory';
import { SimICND2 } from '../icnd2';
import { ScoreItem } from './examitem-score';

import { ExamItemTester } from '../tester/examitem-tester';
import { ExamItemSpec, IExamItemStep, IExamItemTask, IExamItemTasks } from '../tester/examitem-spec';
import { ExamItemPaths, PathCommand, CalculatePathOptions, IPathPart } from '../tester/examitem-path';
import { icnd2SimSpec } from '../icnd2-simspec';
import { icnd2ScoreKey } from '../icnd2-scorekey';

//export function main() {

  // xdescribe('ScoreExamItem', () => {

  // });
//}
