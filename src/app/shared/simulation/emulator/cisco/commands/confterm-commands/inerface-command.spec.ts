import { Observable } from 'rxjs/Observable';
import { TerminalCommand } from '../../../interfaces/terminal-command';
import { CommandState } from '../../../interfaces/command-state';
import { StateContainer } from '../../../emulator-state';
import { CiscoCommandParser } from '../../command-parser';
import { CiscoCommandContext } from '../../cisco-terminal-command';
import { interfaceCommand, interfaceRangeCommand } from './interface-command';
import { channelGroupCommand } from '../channel-group-command';


export interface CommandTestCase {
  commands: string | string [];
  result?: any;
  output?: string | string [];
}

export function main() {

  let interfaceRangeCases: CommandTestCase[] = [{
    commands: 'interface range gigabitethernet 1/0-1',
    result: {
          enabled: true,
          confTerminal: true,
          confInterface: true,
          interfaces: ['GigabitEthernet1/0', 'GigabitEthernet1/1'],
      }
    }
  ];

  // TODO: Move logic to a testing toolkit
  describe('interface range', () => {

    beforeEach(() => {});



    for (let item of interfaceRangeCases) {
        let commandContext: CiscoCommandContext = {
          enabled: true,
          confTerminal: true,
          confInterface: false
          // TODO: interfaces = [...]
        };
      let commandLines = (Array.isArray(item.commands)) ? item.commands : [item.commands];
      for (let cmdLine of commandLines){
        it(cmdLine, () => {
          var result = testInvoke(commandContext, channelGroupCommand, cmdLine);

          let expectedResult = item.result ? item.result : {};
          expect(JSON.stringify(result)).toEqual(JSON.stringify(item.result));

          // TODO: Check the output
        });
      }
    }
  });

}
function testInvoke(context: CiscoCommandContext, target: TerminalCommand, commandLine: string): any {

  let parsed = CiscoCommandParser.Parse(commandLine, [target]);

  // TODO: code duplication (see cisco-terminal.ts)
  // let cmdState = CommandState.getCommandState();
  let cmdState = new CommandState();
  for (let index = 0; index < parsed.commands.length; index++) {
    let command = parsed.commands[index].command;
    if (command.handler) {
      cmdState.command = parsed.commands[index];
      command.handler(context, cmdState);
    } else if (command.handler === undefined) {
      // TODO: Unsupported command
    }
  }

  return context;
}
