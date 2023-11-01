import {ParameterList, ParameterValueType, Parameter} from '../interfaces/terminal-parameter';
import {CiscoParameterParser} from './parameter-parser';
import {ParseCommandResult} from '../interfaces/parsed-command';

class ParameterParserTest {

    static testSpanningTree() {
        const spanningTreeVlanParams: ParameterList = {
            sequential: true,
            required: true,
            parameters: [
                {propertyName: 'vlan-id', type: ParameterValueType.boundedNumber(1, 4095)},
                {   // sequential: false, required: false
                    parameters: [
                        {name: 'forward-time', type: ParameterValueType.number},
                        {name: 'hello-time', type: ParameterValueType.number},
                        {name: 'max-age', type: ParameterValueType.number},
                        {name: 'priority', type: ParameterValueType.number},
                        {name: 'protocol', type: ParameterValueType.number},
                        {
                            sequential: true,
                            required: false,
                            parameters: [
                                {name: 'root'},
                                {
                                    required: true, parameters: [
                                    {name: 'primary'}, {name: 'secondary'}
                                ]
                                },
                                {
                                    sequential: true, required: false, parameters: [
                                    {name: 'diameter', type: ParameterValueType.number},
                                    {
                                        parameters: [
                                            {name: 'hello-time', type: ParameterValueType.number}
                                        ]
                                    }
                                ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const p1 = {name: 'alfa'};
        const p1a = {name: 'altitude'};
        const p2 = {name: 'bravo', type: ParameterValueType.number};
        const p3 = {propertyName: 'charlie', type: ParameterValueType.number};
        const p4 = {name: 'delta', type: ParameterValueType.boundedNumber(1, 20)};
        const p5 = {name: 'echo'};
        const p6 = {name: 'golf'};
        const p7 = {name: 'hotel'};
        const p8 = {name: 'india'};
        const p9 = {name: 'juliett'};
        const p10 = {name: 'kilo'};
        const p11 = {name: 'lima'};
        const p12 = {name: 'mike'};
        const p13 = {name: 'november'};
        const p14 = {name: 'oscar'};
        const p15 = {name: 'papa'};
        const p16 = {name: 'quebec'};
        const p17 = {name: 'romeo'};

        const l1 = {
            required: true,
            sequential: true,
            parameters: [p1, p2, p3]
        };
        const l2 = {
            required: true,
            sequential: false,
            parameters: [p1, p2, p3]
        };
        const l3 = {
            required: false,
            sequential: true,
            parameters: [p1, p2, p3]
        };
        const l4 = {
            required: false,
            sequential: false,
            parameters: [p1, p2, p3]
        };
        const l5 = {
            required: true,
            sequential: false,
            parameters: [p1, p1a, p2]
        };
        const l6 = {
            required: true,
            sequential: true,
            parameters: [p1, p2, p3]
        };
        const l7 = {
            required: false,
            sequential: true,
            parameters: [p4, p5, p6]
        };
        const l8 = {
            required: true,
            sequential: true,
            parameters: [p7, p8, p9]
        };
        const l9 = {
            required: true,
            sequential: true,
            parameters: [l6, l7, l8]
        };

        // tests
        // named param with no value
        it('parses a named parameter with no value', () => {
            const tokens: string[] = 'alfa'.split(' ');
            const result = CiscoParameterParser.Parse(tokens, p1).properties;
            const expected = {'alfa': true};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));

        });
        // named param with value
        it('parses a named paramater with value', () => {
            const tokens = 'bravo 13'.split(' ');
            const result = CiscoParameterParser.Parse(tokens, p2).properties;
            const expected = {bravo: '13'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it('fails to parse an invalid token on a named parameter', () => {
            const tokens = 'alfa 13'.split(' ');
            const result = CiscoParameterParser.Parse(tokens, p2);
            expect(result.parseResult).toEqual(ParseCommandResult.Invalid);
        });
        it('parses an unamed parameter with a value', () => {
            const tokens = '13'.split(' ');
            const result = CiscoParameterParser.Parse(tokens, p3).properties;
            const expected = {charlie: '13'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it('parses a named parameter with a bounded value', () => {
            const tokens = 'delta 13'.split(' ');
            const result = CiscoParameterParser.Parse(tokens, p4).properties;
            const expected = {delta: '13'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it('parses a named parameter with an out of bounds value', () => {
            const tokens = 'delta 200'.split(' ');
            const result = CiscoParameterParser.Parse(tokens, p4);
            expect(result.parseResult).toEqual(ParseCommandResult.Invalid);
        });
        it('parses a required sequential list', () => {
            const tokens = 'alfa bravo 13 12'.split(' ');
            const result = CiscoParameterParser.Parse(tokens, l1).properties;
            const expected = {alfa: true, bravo: '13', charlie: '12'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it('fails a required sequential list with invalid tokens', () => {
            const tokens = 'alfa alfa 13'.split(' ');
            const result = CiscoParameterParser.Parse(tokens, l1);
            expect(result.parseResult).toEqual(ParseCommandResult.Invalid);
        });
        it('parses a required or list', () => {
            let tokens = '13'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, l2).properties;
            let expected: any = {charlie: '13'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));

            tokens = 'bravo 13'.split(' ');
            result = CiscoParameterParser.Parse(tokens, l2).properties;
            expected = {'bravo': '13'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it('correctly fails on zero tokens on a required sequential list', () => {
            const tokens: string[] = [];
            const result = CiscoParameterParser.Parse(tokens, l1);
            expect(result.parseResult).toEqual(ParseCommandResult.Invalid);
        });
        it('correctly fails on zero tokens on a required or list', () => {
            const tokens: string[] = [];
            const result = CiscoParameterParser.Parse(tokens, l2);
            expect(result.parseResult).toEqual(ParseCommandResult.Invalid);
        });
        // optional lists

        it('parses an optional sequential list', () => {
            const tokens = 'alfa bravo 13 12'.split(' ');
            const result = CiscoParameterParser.Parse(tokens, l3).properties;
            const expected = {alfa: true, bravo: '13', charlie: '12'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it('fails an optional sequential list with invalid tokens', () => {
            const tokens = 'alfa alfa 13'.split(' ');
            const result = CiscoParameterParser.Parse(tokens, l3);
            expect(result.parseResult).toEqual(ParseCommandResult.Invalid);
        });
        it('parses an optional or list', () => {
            let tokens = '13'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, l4).properties;
            let expected: any = {charlie: '13'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));

            tokens = 'bravo 13'.split(' ');
            result = CiscoParameterParser.Parse(tokens, l4).properties;
            expected = {'bravo': '13'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it('correctly ignores zero tokens on an optional sequential list', () => {
            const tokens: string[] = [];
            const result = CiscoParameterParser.Parse(tokens, l3);
            expect(result.parseResult).toEqual(ParseCommandResult.Success);
        });
        it('correctly ignores zero tokens on an optional or list', () => {
            const tokens: string[] = [];
            const result = CiscoParameterParser.Parse(tokens, l4);
            expect(result.parseResult).toEqual(ParseCommandResult.Success);
        });
        // combos!

        it('parses an complex parameter structure', () => {
            let tokens = 'alfa bravo 13 13 delta echo golf hotel india juliett'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, l9).properties;
            let expected: any = {
                'alfa': true,
                'bravo': '13',
                'charlie': '13',
                'delta': true,
                'echo': true,
                'golf': true,
                'hotel': true,
                'india': true,
                'juliett': true
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));

            tokens = 'alfa bravo 13 13 hotel india juliett'.split(' ');
            result = CiscoParameterParser.Parse(tokens, l9).properties;
            expected = {'alfa': true, 'bravo': '13', 'charlie': '13', 'hotel': true, 'india': true, 'juliett': true};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));

        });
        // other behavior
        it('correctly parses shortcuts', () => {
            const tokens = 'a b 13 12'.split(' ');
            const result = CiscoParameterParser.Parse(tokens, l1).properties;
            const expected = {alfa: true, bravo: '13', charlie: '12'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it('correctly identifies ambiguous input', () => {
            const tokens = 'al b 13'.split(' ');
            const result = CiscoParameterParser.Parse(tokens, l5);
            expect(result.parseResult).toEqual(ParseCommandResult.Ambiguous);
        });

        // combos!
    }
}


//export function main() {
    describe('parameter-parser', () => {

        beforeEach(() => {
        });
        ParameterParserTest.testSpanningTree();

    });
//}

