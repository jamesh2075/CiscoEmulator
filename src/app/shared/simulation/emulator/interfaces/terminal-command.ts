import {CiscoCommandContext} from '../cisco/cisco-terminal-command';
import {CommandState} from './command-state';
import {ICommandParameter} from './terminal-parameter';

export interface TerminalCommand {
    name: string;
    description: string;
    children?: TerminalCommand[];
    parameters?: ICommandParameter;
    handler?: (cmdContext: CiscoCommandContext, cmdState: CommandState) => void;
    validator?: (token: string) => boolean;
    notTerminalFlag?: boolean;
    aliases?: string[];
    noHelp?: boolean;   // if this is true, then this command won't show up in autocomplete or help (example: do)
    token?: string; // I could't find a better way to get this information to the cmdState

}

// export class TerminalCommand implements ITerminalCommand {
//   name: string;
//   description: string;
//   children?: TerminalCommand[];
//   parameters?: ICommandParameter[];
//   handler?: {(cmdContext: CiscoCommandContext, cmdState: CommandState): void};
//   accept (token:string):boolean{
//     return this.name.toLowerCase().startsWith(token.toLowerCase());
//   }
//   query():void {} //loops through children and dispays their help text

//   static TerminalCommand(data:ITerminalCommand) : TerminalCommand {
//     //TODO: loop through children and make sure that they are converted too
//     let result = new TerminalCommand();
//     result.name = data.name;
//     result.description = data.description;
//     result.parameters = data.parameters;

//     result.handler = data.handler;
//     if(data.children){
//       result.children = [];
//       for(let i = 0; i < data.children.length; i++) {
//         let child = data.children[i];
//         if(child instanceof TerminalCommand)
//           result.children.push(child)
//         else
//           result.children.push(TerminalCommand.TerminalCommand(child));
//       }
//     }
//     return result;
//   }
// }

// export class TerminalInteger extends TerminalCommand{
//   constructor(description:string, children: TerminalCommand[]){
//     super();
//     this.description = description;
//     if(children){
//       this.children = children;
//     }

//   }
//   accept(token: string): boolean {
//     if(token.trim().match(/\d+/))
//       return true;
//     return false;
//   }
// }
