import { IEmulatedTerminal } from '../../emulator/interfaces/iemulated-terminal';
import { Simulation } from '../../simulation';
import { SimDefinition, SimTask, SimDevice, SimDeviceType, SimNetworkInterface, SimCommandData, SimConnection } from '../../sim-definition';
import { SimulationFactory } from '../../simulation.factory';
import { IExamItemStep, IExamItemTask, IExamItemTasks } from './examitem-spec';
import { ExamItemScoreKey, ITaskScoreKey, IVerification } from '../score/scorekey';
import { ScoreItem } from '../score/examitem-score';
import { AsArray, AsSingle } from '../../emulator/util';

export class CalculatePathOptions {
  /** Whether to create a path for each command version listed in commandLine[] as a correct choice path
   *
   * If not set to true, a path is only created for commandLine[0]
   */
  includeCommandLineForms?: boolean;
}

export interface PathCommand {
  /** An optional description of the command */
  label?: string;
  /** The list of devices that the command should be invoked on */
  devices: string | string[];
  /** The list of interfaces that should be selected on each device */
  interfaces?: string | string[]; // TODO: Change to an object (InterfacesDefinition?)
  /** The command to be invoked */
  commandLine: string;
}

export class ExamItemPaths {
  public taskPathParts: { [key: string]: IPathPart | IPathPart[] } = {};
  public taskPaths: { [key: string]: number[][] } = {};

  GetPathCount(): number {
    // TODO: A task with a distractor prevents later tasks from completing successfully,
    // so all paths beginning with a task w/distractor are equivalent
    let result = 1;
    for (const taskId in this.taskPaths) {
      result *= this.taskPaths[taskId].length;
    }
    return result;
  }

  /**
   * Selects a path index for each task based on a single ordinal
   * @param ordinal
   */
  GetTaskPathIndexByOrdinal(ordinal: number): { [key: string]: number } {
    // TODO: A task with a distractor prevents later tasks from completing successfully,
    // so all paths beginning with a task w/distractor are equivalent
    const result: { [key: string]: number } = {};

    for (const taskId in this.taskPaths) {
      // counts.push(this.taskPaths[taskId].length);
      if (ordinal) {
        const thisCount = this.taskPaths[taskId].length;
        const thisIndex = ordinal % thisCount;

        result[taskId] = thisIndex;
        ordinal = (ordinal - thisIndex) / thisCount;
      } else {
        result[taskId] = 0; // use index 0
      }
    }

    return result;
  }

  GetPathCommandsByTaskPathIndex(indexes: { [key: string]: number }): { [key: string]: PathCommand[] } {
    // convert index numbers to paths
    const paths: { [key: string]: number[] } = {};
    for (const taskId in this.tasks) {
      let index = 0;
      if (indexes[taskId]) {
        index = indexes[taskId];
      }
      // if the path index is out of range, use the path at index zero
      if (index > this.taskPaths[taskId].length) {
        index = 0;
      }
      paths[taskId] = this.taskPaths[taskId][index];
    }

    return this.GetPathCommands(paths);
  }

  GetPathCommands(paths: { [key: string]: number[] }): { [key: string]: PathCommand[] } {
    const result: { [key: string]: PathCommand[] } = {};

    for (const taskId in this.tasks) {
      result[taskId] = this.GetTaskPathCommands(taskId, paths[taskId]);
    }

    return result;
  }

  GetTaskPathCommands(taskId: string, path: number[]): PathCommand[] {
    const pathParts = AsArray(this.taskPathParts[taskId]);
    if (!pathParts) {
      throw new Error(`Invalid taskId ${taskId} or paths not initialized`);
    }

    const pathCopy: number[] = [...path]; // Don't modify the path passed in by the caller
    let result: PathCommand[] = [];
    for (const pathPart of pathParts) {
      const commands = this.GetPathPartCommands(pathPart, pathCopy);
      result = [...result, ...commands];
    }
    return result;
  }

  GetTaskPathsByOrdinal(ordinal: number): { [key: string]: number[] } {
    const result: { [key: string]: number[] } = {};

    const pathIdx = this.GetTaskPathIndexByOrdinal(ordinal);
    for (const taskId in pathIdx) {
      const pathIndex = pathIdx[taskId];
      result[taskId] = this.taskPaths[taskId][pathIndex];
    }

    return result;
  }

  constructor(public tasks: IExamItemTasks, pathOptions?: CalculatePathOptions) {
    // private simDefinition: SimDefinition, private scoreKey: ExamItemScoreKey) {
    pathOptions = pathOptions || {};
    this.BuildTaskPaths(tasks, pathOptions);
  }

  private GetPathPartCommands(pathPart: IPathPart, path: number[]): PathCommand[] {
    const choice = pathPart.getChoice(path[0]);
    path.splice(0, 1); // remove the path choice we just consumed

    if (Array.isArray(choice.pathPart)) {
      // let steps = AsArray(choice.steps);
      const parts = AsArray(choice.pathPart);
      let result: PathCommand[] = [];

      // this path choice doesn't do anything on its own, just selects the next batch of steps
      for (const part of parts) {
        const commands = this.GetPathPartCommands(part, path);
        result = [...result, ...commands];
      }

      return result;
    } else {
      if (choice instanceof CommandChoice) {
        const cmdChoice = choice as CommandChoice;
        return [cmdChoice.command];
      } else {
        // just another step
        const part = choice.pathPart as IPathPart;
        return this.GetPathPartCommands(part, path);
      }
    }
  }

  /**
   * Returns an array of paths containing every combination of a selection from first and a selection from second
   * @param first
   * @param second
   */
  private ChainChoices(first: number[][], second: number[][]): number[][] {
    if (!first || !first.length) {
      return second;
    }
    if (!second || !second.length) {
      return first;
    }

    const result: number[][] = [];
    for (const firstIndex = 0; firstIndex < first.length; firstIndex++) {
      for (const secondIndex = 0; secondIndex < second.length; secondIndex++) {
        const combined: number[] = [ ...first[firstIndex], ...second[secondIndex] ];
        result.push(combined);
      }
    }
    return result;
  }

  private ExpandChoices(pathParts: IPathPart | IPathPart[]): number[][] {
    let result: number[][] = [];
    if (!pathParts) {
      return result;
    }

    const paths: IPathPart[] = ((Array.isArray(pathParts)) ? pathParts : [pathParts]) as IPathPart[];

    // starting from the last step, expand the choices for the step,
    for (const pathIndex = paths.length - 1; pathIndex >= 0; pathIndex--) {
      const path = paths[pathIndex];
      const pathResult: number[][] = [];

      if (path.correct) {
        for (const index = 0; index < path.correct.length; index++) {
          const item = path.correct[index];
          const itemPaths = this.ExpandChoices(item.pathPart);
          if (!itemPaths.length) {
            // no children, just represent this choice
            pathResult.push([index]);
          } else {
            if (itemPaths && itemPaths.length > 0) {
              // add each as a child path
              for (let subIndex = 0; subIndex < itemPaths.length; subIndex++) {
                pathResult.push([index, ...itemPaths[subIndex]]);
              }
            }
          }
        }
      }
      if (path.incorrect) {
        for (const index = 0; index < path.incorrect.length; index++) {
          const item = path.incorrect[index];
          const choiceIndex = (index + 1) * (-1);
          const itemPaths = this.ExpandChoices(item.pathPart);
          if (!itemPaths.length) {
            // no children, just represent this choice
            pathResult.push([choiceIndex]);
          } else {
            if (itemPaths && itemPaths.length > 0) {
              // add each distractor as a child path
              for (let subIndex = 0; subIndex < itemPaths.length; subIndex++) {
                pathResult.push([choiceIndex, ...itemPaths[subIndex]]);
              }
            }
          }
        }
      }
      if (pathResult.length === 0) {
        // debugger;
        throw new Error('Path part has no choices');
      }

      // combine this path's result with the next path's result (previous iteration)
      if (pathResult.length) {
        result = this.ChainChoices(pathResult, result);
      }
    }
    return result;
  }

  private BuildTaskPaths(tasks: IExamItemTasks, options: CalculatePathOptions) {
    if (!options) {
      options = new CalculatePathOptions();
    }

    for (const taskId in tasks) {
      // console.log('Calculating for task ' + taskId);
      this.taskPathParts[taskId] = this.BuildStepsPaths(tasks[taskId], options);
      this.taskPaths[taskId] = this.ExpandChoices(this.taskPathParts[taskId]);
    }
  }


  private BuildStepsPaths(
    stepOrSteps: IExamItemStep | IExamItemStep[],
    options: CalculatePathOptions,
    inheritDevices?: string | string[],
    inheritInterfaces?: string | string[]): IPathPart | IPathPart[] {
    if (Array.isArray(stepOrSteps)) {
      const steps = stepOrSteps as IExamItemStep[];
      const result: IPathPart[] = [];
      for (const step of steps) {
        result.push(this.BuildSingleStepPaths(step, options, inheritDevices, inheritInterfaces));
      }
      return result;
    } else {
      const step = stepOrSteps as IExamItemStep;
      return this.BuildSingleStepPaths(step, options, inheritDevices, inheritInterfaces);
    }
  }

  private BuildSingleStepPaths(
    step: IExamItemStep,
    options: CalculatePathOptions,
    inheritDevices: string | string[],
    inheritInterfaces: string | string[]
  ): IPathPart {
    const path = new PathPart;
    inheritDevices = step.devices || inheritDevices;
    inheritInterfaces = step.interfaces || inheritInterfaces;

    // child steps
    let childPaths = 0;
    if (step.selectOneStep) {
      const selectSteps = ((Array.isArray(step.selectOneStep)) ? step.selectOneStep : [step.selectOneStep]) as IExamItemStep[];
      childPaths += selectSteps.length;
      for (const selectStep of selectSteps) {
        // add each as a path
        path.correct.push(new StepChoice(selectStep, this.BuildSingleStepPaths(selectStep, options, inheritDevices, inheritInterfaces)));
      }
    } else if (step.steps) {
      const steps = ((Array.isArray(step.steps)) ? step.steps : [step.steps]) as IExamItemStep[];
      // add all steps as a single path
      path.correct.push(new StepChoice(steps, this.BuildStepsPaths(steps, options, inheritDevices, inheritInterfaces)));
    }

    // child distractor steps
    if (step.distractorSteps) {
      const distractorSteps = ((Array.isArray(step.distractorSteps)) ? step.distractorSteps : [step.distractorSteps]) as IExamItemStep[];
      childPaths += distractorSteps.length;
      for (const distractorStep of distractorSteps) {
        path.incorrect.push(new StepChoice(distractorStep,
          this.BuildSingleStepPaths(distractorStep, options, inheritDevices, inheritInterfaces)));
      }
    }

    // multiple valid command lines
    if (step.commandLine) {
      const cmdLineForms = ((Array.isArray(step.commandLine)) ? step.commandLine : [step.commandLine]) as string[];
      if (options.includeCommandLineForms) {
        for (const cmdLineForm of cmdLineForms) {
          const cmd: PathCommand = { devices: inheritDevices, interfaces: inheritInterfaces, commandLine: cmdLineForm };
          path.correct.push(new CommandChoice(step, cmd));
        }
      } else {
        // only use the first command line
        const cmd: PathCommand = { devices: inheritDevices, interfaces: inheritInterfaces, commandLine: cmdLineForms[0] };
        path.correct.push(new CommandChoice(step, cmd));
      }
    }

    // distractor command lines
    if (step.distractors) {
      const distractors = ((Array.isArray(step.distractors)) ? step.distractors : [step.distractors]) as string[];
      for (const distractor of distractors) {
        const cmd: PathCommand = { devices: inheritDevices, interfaces: inheritInterfaces, commandLine: distractor };
        path.incorrect.push(new CommandChoice(step, cmd));
      }
    }

    return path;
  }
}

export function IsDistractorPath(path: number[]): boolean {
  return (path.find((value) => value < 0)) ? true : false;
}

export interface IPathPart {
  correct: IPathChoice[];
  incorrect: IPathChoice[];
  getChoice(index: number): IPathChoice;
}
class PathPart implements IPathPart {
  correct: IPathChoice[] = [];
  incorrect: IPathChoice[] = [];
  getChoice(index: number): IPathChoice {
    if (index < 0) {
      // distractor
      const choiceIndex = (index + 1) * (-1);
      return this.incorrect[choiceIndex];
    } else {
      return this.correct[index];
    }
  }
}

interface IPathChoice {
  steps: IExamItemStep | IExamItemStep[];
  pathPart: IPathPart | IPathPart[];
}

class StepChoice implements IPathChoice {
  constructor(public steps: IExamItemStep | IExamItemStep[], public pathPart: IPathPart | IPathPart[]) {}
}

class CommandChoice implements IPathChoice {
  pathPart: IPathPart | IPathPart[] = null;

  constructor(public steps: IExamItemStep | IExamItemStep[], public command: PathCommand) {
  }
}

