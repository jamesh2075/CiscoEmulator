import { CommandTester, CommandTestCase } from '../commands/command-tester';
import { CiscoFormatters } from './cisco-formatters';

//export function main() {
    describe('normalizeNumberSet()', () => {
        describe('normalizeNumberSet([1,2,3,10,11,15])', () => {
            const target = '1-3,10-11,15';
            const source: number[] = [1, 2, 3, 10, 11, 15];

            it(`expect to be ${target}`, () => {
                const result = CiscoFormatters.normalizeNumberSet(source);
                expect(result).toBe(target);
            });
        });

        describe('normalizeNumberSet([10,11,15,1,2,3])', () => {
            const target = '1-3,10-11,15';
            const source: number[] = [10, 11, 15, 1, 2, 3];

            it(`expect to be ${target}`, () => {
                const result = CiscoFormatters.normalizeNumberSet(source);
                expect(result).toBe(target);
            });
        });

        describe('normalizeNumberSet([1,1,1,4,4,4,2,2,2])', () => {
            const target = '1-2,4';
            const source: number[] = [1, 1, 1, 4, 4, 4, 2, 2, 2];

            it(`expect to be ${target}`, () => {
                const result = CiscoFormatters.normalizeNumberSet(source);
                expect(result).toBe(target);
            });
        });

        describe('normalizeNumberSet([1,2,3])', () => {
            const target = '1-3';
            const source: number[] = [1, 2, 3];

            it(`expect to be ${target}`, () => {
                const result = CiscoFormatters.normalizeNumberSet(source);
                expect(result).toBe(target);
            });
        });

        describe('normalizeNumberSet([1,10])', () => {
            const target = '1,10';
            const source: number[] = [1, 10];

            it(`expect to be ${target}`, () => {
                const result = CiscoFormatters.normalizeNumberSet(source);
                expect(result).toBe(target);
            });
        });
    });
//}

