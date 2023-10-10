import { CiscoCommandContext, TerminalCommand, StateContainer } from "../index";
import { CiscoCommandParser } from "../emulator/cisco/command-parser";
import { CommandState } from "../emulator/interfaces/command-state";
import { NotSupportedCommand } from "../emulator/cisco/commands/notsupported";

export interface CommandTestCase {
  commands: string | string[];
  result?: any;
  output?: string | string[];
  initialContext?: CiscoCommandContext; // default Interface context (conf-if)#
  expectedContext?: CiscoCommandContext;
}
interface CommandTestCaseResult {
  context: CiscoCommandContext,
  cmdState: CommandState, //access to output through cmdState
  changes?: any
}
export class UnitTestKit {


  static RunTestCases(testName: string, testCases: CommandTestCase[], 
    target: TerminalCommand) {
    describe(testName, () => {

      beforeEach(() => { });

      let commandContext: CiscoCommandContext = {
        enabled: true,
        confTerminal: true,
        confInterface: true
        // TODO: interfaces = [...]
      };

      for (let item of testCases) {
        let commandLines = (Array.isArray(item.commands)) ? item.commands : [item.commands];
        for (let cmdLine of commandLines) {
          it(cmdLine, () => {
            //default context
            let commandContext = item.initialContext ? item.initialContext : {
              enabled: true,
              confTerminal: true,
              confInterface: true};
            var result:CommandTestCaseResult = UnitTestKit.TestInvoke(commandContext, target, cmdLine);

            let expectedResult = item.result ? item.result : {};
            expect(JSON.stringify(result.changes)).toEqual(JSON.stringify(item.result));

            //Check the output
            let expectedOutput = item.output ? Array.isArray(item.output) ? item.output : [item.output] : [];
            expect(JSON.stringify(result.cmdState.output)).toEqual(JSON.stringify(item.output));

            // TODO: check the resulting context
            let expectedContext = item.expectedContext ? item.expectedContext : commandContext;
            expect(JSON.stringify(result.context)).toEqual(JSON.stringify(expectedContext));

          });
        }
      }
    });



  }
  static TestInvoke(context: CiscoCommandContext, target: TerminalCommand, 
    commandLine: string): CommandTestCaseResult {

    let parsed = CiscoCommandParser.Parse(commandLine, [target]);

    let cmdState = CommandState.getCommandState();
    for (let index = parsed.commands.length - 1; index >= 0; index--) {
      let command = parsed.commands[index].command;
      let handler = command.handler;
      if (handler === undefined) {
        handler = NotSupportedCommand.NotSupported;
      }
      if (handler) {
        cmdState.command = parsed.commands[index];
        handler(context, cmdState);
        if (cmdState.stopProcessing) {
          break;
        }
      }
    }

    let result = {context, cmdState, changes:{}};
    let state = new StateContainer(result.changes);
    for (let stateChange of cmdState.changes) {
      state.setProperty(stateChange.selector, stateChange.value);
    }

    return result;
  }

}
