import {ParameterList, ParameterValueType, Parameter} from '../interfaces/terminal-parameter';
import {CiscoParameterParser} from './parameter-parser';
import {ParseCommandResult} from "../interfaces/parsed-command";

class ParameterParserTest {

    static testSpanningTree() {
        let spanningTreeVlanParams: ParameterList = {
            sequential: true,
            required: true,
            parameters: [
                {propertyName: 'vlan-id', type: ParameterValueType.boundedNumber(1, 4095)},
                {   //sequential: false, required: false
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

        let p1 = {name: 'alfa'};
        let p1a = {name: 'altitude'};
        let p2 = {name: 'bravo', type: ParameterValueType.number};
        let p3 = {propertyName: 'charlie', type: ParameterValueType.number};
        let p4 = {name: 'delta', type: ParameterValueType.boundedNumber(1, 20)};
        let p5 = {name: 'echo'};
        let p6 = {name: 'golf'};
        let p7 = {name: 'hotel'};
        let p8 = {name: 'india'};
        let p9 = {name: 'juliett'};
        let p10 = {name: 'kilo'};
        let p11 = {name: 'lima'};
        let p12 = {name: 'mike'};
        let p13 = {name: 'november'};
        let p14 = {name: 'oscar'};
        let p15 = {name: 'papa'};
        let p16 = {name: 'quebec'};
        let p17 = {name: 'romeo'};

        let l1 = {
            required: true,
            sequential: true,
            parameters: [p1, p2, p3]
        };
        let l2 = {
            required: true,
            sequential: false,
            parameters: [p1, p2, p3]
        };
        let l3 = {
            required: false,
            sequential: true,
            parameters: [p1, p2, p3]
        };
        let l4 = {
            required: false,
            sequential: false,
            parameters: [p1, p2, p3]
        };
        let l5 = {
            required: true,
            sequential: false,
            parameters: [p1, p1a, p2]
        };
        let l6 = {
            required: true,
            sequential: true,
            parameters: [p1, p2, p3]
        };
        let l7 = {
            required: false,
            sequential: true,
            parameters: [p4, p5, p6]
        };
        let l8 = {
            required: true,
            sequential: true,
            parameters: [p7, p8, p9]
        };
        let l9 = {
            required: true,
            sequential: true,
            parameters: [l6, l7, l8]
        };

        //tests
        // named param with no value
        it('parses a named parameter with no value', () => {
            let tokens: string[] = 'alfa'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, p1).properties;
            let expected = {'alfa': true};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));

        });
        // named param with value
        it('parses a named paramater with value', () => {
            let tokens = 'bravo 13'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, p2).properties;
            let expected = {bravo: "13"};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it('fails to parse an invalid token on a named parameter', () => {
            let tokens = 'alfa 13'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, p2);
            expect(result.parseResult).toEqual(ParseCommandResult.Invalid);
        });
        it('parses an unamed parameter with a value', () => {
            let tokens = '13'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, p3).properties;
            let expected = {charlie: '13'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it('parses a named parameter with a bounded value', () => {
            let tokens = 'delta 13'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, p4).properties;
            let expected = {delta: '13'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it('parses a named parameter with an out of bounds value', () => {
            let tokens = 'delta 200'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, p4);
            expect(result.parseResult).toEqual(ParseCommandResult.Invalid);
        });
        it('parses a required sequential list', () => {
            let tokens = 'alfa bravo 13 12'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, l1).properties;
            let expected = {alfa: true, bravo: '13', charlie: '12'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it('fails a required sequential list with invalid tokens', () => {
            let tokens = 'alfa alfa 13'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, l1);
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
            let tokens: string[] = [];
            let result = CiscoParameterParser.Parse(tokens, l1);
            expect(result.parseResult).toEqual(ParseCommandResult.Invalid);
        });
        it('correctly fails on zero tokens on a required or list', () => {
            let tokens: string[] = [];
            let result = CiscoParameterParser.Parse(tokens, l2);
            expect(result.parseResult).toEqual(ParseCommandResult.Invalid);
        });
        //optional lists

        it('parses an optional sequential list', () => {
            let tokens = 'alfa bravo 13 12'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, l3).properties;
            let expected = {alfa: true, bravo: '13', charlie: '12'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it('fails an optional sequential list with invalid tokens', () => {
            let tokens = 'alfa alfa 13'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, l3);
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
            let tokens: string[] = [];
            let result = CiscoParameterParser.Parse(tokens, l3);
            expect(result.parseResult).toEqual(ParseCommandResult.Success);
        });
        it('correctly ignores zero tokens on an optional or list', () => {
            let tokens: string[] = [];
            let result = CiscoParameterParser.Parse(tokens, l4);
            expect(result.parseResult).toEqual(ParseCommandResult.Success);
        });
        //combos!

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
        //other behavior
        it('correctly parses shortcuts', () => {
            let tokens = 'a b 13 12'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, l1).properties;
            let expected = {alfa: true, bravo: '13', charlie: '12'};
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it('correctly identifies ambiguous input', () => {
            let tokens = 'al b 13'.split(' ');
            let result = CiscoParameterParser.Parse(tokens, l5);
            expect(result.parseResult).toEqual(ParseCommandResult.Ambiguous);
        });

        // combos!
    }
}


export function main() {
    describe('parameter-parser', () => {

        beforeEach(() => {
        });
        ParameterParserTest.testSpanningTree();

    });
}

