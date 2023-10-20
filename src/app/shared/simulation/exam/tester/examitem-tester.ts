// import { Observable, BehaviorSubject } from 'rxjs/Rx';
// import { IEmulatedDevice } from '../../emulator/interfaces/iemulated-device';
import { IEmulatedTerminal, CommandResult, CommandResultCode } from '../../emulator/interfaces/iemulated-terminal';
import { Simulation } from '../../simulation';
import { SimDefinition, SimTask, SimDevice, SimDeviceType, SimNetworkInterface, SimCommandData, SimConnection } from '../../sim-definition';
import { SimulationFactory } from '../../simulation.factory';
import { diff } from '../../emulator/cisco/model/utils/diff';
import { AsArray, AsSingle } from '../../emulator/util';

import { ExamItemPaths, PathCommand, CalculatePathOptions } from './examitem-path';
import { IExamItemStep, IExamItemTask, IExamItemTasks } from './examitem-spec';
import { ExamItemScoreKey, ITaskScoreKey, IVerification } from '../score/scorekey';
import { ScoreItem, ScoreResult } from '../score/examitem-score';
import { DeviceInvoker, DeviceInvokeResult, InterfaceSelector } from './device-invoker';


export class IterateOptions {
  /** whether to include each form of each interface selector (1: 'gi0/1', 2: 'GigabitEthernet 0/1') */
  includeInterfaceNameForms?: boolean;
  /** whether to include extra name forms of each interface identifier (1: 'gi0/1', 2: 'gig 0/1', 3: 'GigabitEthernet 0/1', ...) */
  includeInterfaceNameVariations?: boolean;
  /** whether to include both range and individual permutations of interfaces[] (1: ['gi1/0', 'gi1/1'], 2: range: 'gi1/0-1') */
  includeInterfaceRange?: boolean;
};

export interface PathCommandResult {
  device: string;
  interfaces: string;
  commandLine: string;
  resultCode?: CommandResultCode;
  output?: string;
}
export class TaskResult {
  stateBefore: any;
  stateAfter: any;
  stateDiff: any;
  commands: PathCommandResult[];
  score?: ScoreResult;
}
export class ExamItemPathResult {
  ordinal?: number;
  taskPaths: { [key: string]: number[] };
  taskCommands: { [key: string]: PathCommand[] };
  taskResults: { [key: string]: TaskResult } = {};
}


export class ExamItemTester {

  ///** Returns a set of identifier strings that should be equivalent to the identifier passed in */
  // static interfaceIdentifiers(identifier: string): string[] {
  //  // TODO: Return aliases for 'identifier'

  //  return [identifier]; // Stub implementation
  // }

  ///** Returns a set of range selectors (if any) that can be used to select all of the specified interfaces
  // * with the 'interface range xxx' command
  // */
  // static interfaceRanges(identifiers: string[], includeNameForms?: boolean): string[] {
  //  // TODO: Return all valid range selectors that select all of the interfaces in 'identifiers'

  //  return []; // Stub implementation
  // }

  static InvokePath(sim: Simulation, paths: ExamItemPaths, ordinal: number, scoreKey?: ExamItemScoreKey): ExamItemPathResult {
    const result = new ExamItemPathResult;

    result.taskPaths = paths.GetTaskPathsByOrdinal(ordinal);
    result.taskCommands = paths.GetPathCommands(result.taskPaths);

    const invoker = new CommandInvoker(sim);
    for (const taskId in result.taskCommands) {
      const taskScoreKey: ITaskScoreKey = (scoreKey) ? scoreKey[taskId] : undefined;
      result.taskResults[taskId] = ExamItemTester.InvokeCommands(sim, result.taskCommands[taskId], taskScoreKey);
    }

    return result;
  }

  static InvokeCommands(sim: Simulation, commands: PathCommand[], scoreKey?: ITaskScoreKey): TaskResult {
    const invoker = new CommandInvoker(sim);

    const result = new TaskResult;
    result.stateBefore = sim.getModel();
    result.commands = invoker.invoke(commands);
    result.stateAfter = sim.getModel();
    result.stateDiff = diff(result.stateBefore, result.stateAfter, true);

    if (scoreKey) {
      result.score = ScoreItem(result.stateAfter, scoreKey);
    }

    return result;
  }
}

class CommandInvoker {
  // private commands: BehaviorSubject<PathCommand>;
  // private deviceCommands: Observable<PathCommand>;
  private deviceInvokers: { [key: string]: DeviceInvoker } = {};

  invoke(commands: PathCommand[]): PathCommandResult[] {
    // break commands into blocks according to the interfaces specified
    let results: PathCommandResult[] = [];
    let block: PathCommand[] = [];
    let blockIfaces: string;
    for (const command of commands) {
      const cmdInterfaces: string = (command.interfaces) ? JSON.stringify(command.interfaces) : null;
      if (cmdInterfaces !== blockIfaces) {
        if (block.length > 0) {
          // the current command specifies different interfaces, so process all commands in the current block
          const result = this.invokeOnDevices(block[0].interfaces, block);
          results = [...results, ...result];
          block = [];
        }
        blockIfaces = cmdInterfaces;
      }
      block.push(command);
    }

    // process the last block of commands
    if (block.length > 0) {
      const result = this.invokeOnDevices(block[0].interfaces, block);
      results = [...results, ...result];
    }
    return results;
  }

  constructor(public sim: Simulation) {
    // this.commands = new BehaviorSubject<PathCommand>({ devices: '', commandLine: '' });
    for (const device of sim.devices) {
      if (device.isTerminalEnabled()) {
        this.deviceInvokers[device.name.toLowerCase()] = new DeviceInvoker(device);
      }
    }
  }

  private invokeOnDevices(interfaces: string | string[], commands: PathCommand[]): PathCommandResult[] {
    const perDevice: { [key: string]: PathCommand[] } = {};

    for (const command of commands) {
      const devices = AsArray(command.devices);
      for (const device of devices) {
        const deviceName = device.toLowerCase();
        if (!perDevice[deviceName]) {
          perDevice[deviceName] = [];
        }
        perDevice[deviceName].push(command);
      }
    }

    let results: PathCommandResult[] = [];
    for (const device in perDevice) {
      const invoker = this.deviceInvokers[device];
      if (!invoker) {
        throw new Error(`Invoker for ${device} not found`);
      }
      const deviceResults = invoker.invoke(interfaces, perDevice[device].map(value => value.commandLine));
      const converted = deviceResults.map((value): PathCommandResult => {
        return {
          device: device,
          interfaces: JSON.stringify(value.interfaces),
          commandLine: value.commandLine,
          resultCode: value.resultCode,
          output: value.output
        };
      });
      results = [...results, ...converted];
    }
    return results;
  }
}

