import { TerminalCommand } from "../interfaces/terminal-command";
import { CiscoHelp } from "./cisco-help";


let l2commands: TerminalCommand[] = [
    { name: 'forecastle', description: `...Are you suggesting that coconuts migrate?` },
    { name: 'foxtrot', description: `Well, she turned me into a newt.` },
    { name: 'forum', description: `It's only a model.` },
    { name: 'fortuitism', description: `Burn her!` },
    { name: 'foss', description: `Well, I didn't vote for you.` },
    { name: 'foraminiferous', description: `Who's that then?` },
    { name: 'foehn', description: `No, no, no! Yes, yes. A bit. But she's got a wart.` },
    { name: 'folklore', description: `Ah, now we see the violence inherent in the system!` },
    { name: 'four', description: `The swallow may fly south with the sun, and the house martin or the plover may seek warmer climes in winter, yet these are not strangers to our land.` },
];

let l1commands: TerminalCommand[] = [
    { name: 'alpha', description: `You don't vote for kings.`, children: l2commands },
    { name: 'beta', description: 'She looks like one.' },
    { name: 'charlie', description: 'Bloody Peasant!' },
    { name: 'Alpha', description: 'The nose?' },
    { name: 'ALpha', description: `Shut up! Will you shut up?! But you are dressed as one… Well, I got better. Why? Burn her anyway! We shall say 'Ni' again to you, if you do not appease us.` },
    { name: 'Beta', description: 'Burn her!', noHelp: true },
    { name: 'Charlie', description: 'Ah, now we see the violence inherent in the system!' },
    { name: 'delta', description: `I'm not a witch.` },
];





export function main() {
    describe('Help ? with space', () => {
        it('sorts caps first and excludes Beta', () => {
            let commandLine: string = '';
            let result = CiscoHelp.QueryWithSpace(commandLine, l1commands);
            expect(result.output).toEqual(`  ALpha    Shut up! Will you shut up?! But you are dressed as one… Well, I got
           better. Why? Burn her anyway! We shall say 'Ni' again to you, if you
           do not appease us.
  Alpha    The nose?
  Charlie  Ah, now we see the violence inherent in the system!
  alpha    You don't vote for kings.
  beta     She looks like one.
  charlie  Bloody Peasant!
  delta    I'm not a witch.`);
        });
    });
    describe('Help ? with no space', () => {
        it('excludes Beta', () => {
            let commandLine: string = 'b';
            let result = CiscoHelp.QueryWithoutSpace(commandLine, l1commands);
            expect(result.output).toEqual(`beta`);
        });
        it('arranges columns', () => {
            let commandLine: string = 'alpha fo';
            let result = CiscoHelp.QueryWithoutSpace(commandLine, l1commands);
            expect(result.output).toEqual(`foehn       folklore  foraminiferous  forecastle  
fortuitism  forum     foss            four        
foxtrot`);
        });
    });
}
