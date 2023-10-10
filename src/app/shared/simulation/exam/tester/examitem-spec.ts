
interface IExamItemStepBase {
  /** Describes this command/step */
  label?: string;

  /** The simulated device(s) that an item applies to
   * 
   * If an array, this command applies to each device in the array
   * 
   * If not defined, any device selection is inherited from its container
   */
  devices?: string | string[];

  /** The interface(s) on which the commands are to be invoked 
   * 
   * If an array is specified, the command must be executed on all listed interfaces
   */
  interfaces?: string | string[];
}

export interface IExamItemStep extends IExamItemStepBase {

  /** A mutually exclusive list of steps (choose only one) 
   * 
   * Do not specify both 'selectOneStep' and 'steps'
  */
  selectOneStep?: IExamItemStep | IExamItemStep[];

  /** The commands (or containers) required to successfully complete the step/task 
   * 
   * Do not specify both 'selectOneStep' and 'steps'
  */
  steps?: IExamItemStep | IExamItemStep[];

  /** Commands (or containers) describing incorrect action paths
   * 
   * Distractor paths are mutually exclusive, only one will be chosen if a distractor path is taken
   */
  distractorSteps?: IExamItemStep | IExamItemStep[];

  /** A single command line to execute, optionally specifying multiple equivalent command lines (invoke only one)
   * 
   * If an array is specified, the array specifies various equivalent forms of the command, and a command 
   * will be selected from the list.
   */
  commandLine?: string | string[];

  /** A list of command lines that are incorrect for scoring purposes, but are required to be accepted
   * and supported by the simulation
   * 
   * To simulate an incorrect candidate response, a command line will be selected from the distractors instead
   * of from commandLine
   */
  distractors?: string[];
  
}


export interface IExamItemTask extends IExamItemStep {
}
export type IExamItemTasks = { [key: string]: IExamItemTask | IExamItemTask[]};


export class ExamItemSpec {
  static IsValidExamItem(examSpec: IExamItemTasks): boolean {
    for(let taskId in examSpec) {
      if(!ExamItemSpec.AreTasksValid(examSpec[taskId])) {
        return false;
      }
    }
    return true;
  }
  static AreTasksValid(taskSpec: IExamItemTask | IExamItemTask[]): boolean {
    return ExamItemSpec.AreStepsValid(taskSpec);
  }
  static AreStepsValid(stepsSpec: IExamItemStep | IExamItemStep[]): boolean {
    let steps: IExamItemStep[];
    if(Array.isArray(stepsSpec)) {
      steps = stepsSpec as IExamItemStep[];
    } else {
      steps = [stepsSpec] as IExamItemStep[];
    }

    for(let step of steps){
      if(!ExamItemSpec.IsStepValid(step)) {
        return false;
      }
    }
    return true;
  }
  static IsStepValid(step: IExamItemStep): boolean {
    let hasChildSteps = <boolean> (step.selectOneStep || step.steps || step.distractorSteps);

    if(hasChildSteps) {
      if(step.selectOneStep && step.steps) {
        console.log('Spec error: A step cannot cannot have selectOneStep and steps');
        return false;
      }
      if(step.commandLine || step.distractors) {
        console.log('Spec error: A step cannot have command lines and child steps');
        return false;
      }

      if(step.selectOneStep) {
        if(!ExamItemSpec.AreStepsValid(step.selectOneStep)) return false;
      }
      if(step.steps) {
        if(!ExamItemSpec.AreStepsValid(step.steps)) return false;
      }
      if(step.distractors) {
        if(!ExamItemSpec.AreStepsValid(step.distractors)) return false;
      }

      // TODO: Check for a child step that redefines devices or interfaces that should be inherited
      // if(inherited.devices !== undefined && step.devices !== undefined) {
      //   console.log('Spec error: A step cannot override devices from a parent step');
      //   return false;
      // }
      // if(inherited.interfaces !== undefined && step.interfaces !== undefined) {
      //   console.log('Spec error: A step cannot override interfaces from a parent step');
      //   return false;
      // }

    }
    return true;
  }
}
