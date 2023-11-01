import {isArray, isDate, isEmpty, isEqual, isObject, isString, isUndefined} from './validators';

//export function main() {

    describe('val is declared but not defined', () => {
        const val: any = undefined;
        it('isUndefined() should be true', () => {
            expect(isUndefined(val)).toBeTruthy();
        });
    });

    describe('val is set to new Date()', () => {
        const val = new Date();
        it('isDate() should be true', () => {
            expect(isDate(val)).toBeTruthy();
        });
    });

    describe('val is set to []', () => {
        const val: any = [];
        it('isArray() should be true', () => {
            expect(isArray(val)).toBeTruthy();
        });
    });

    describe('val is set to {}', () => {
        const val: any = {};
        it('isObject() should be true', () => {
            expect(isObject(val)).toBeTruthy();
        });
    });

    describe('val is set to ""', () => {
        const val: any = '';
        it('isString() should be true', () => {
            expect(isString(val)).toBeTruthy();
        });
    });

    describe('isEmpty()', () => {

        describe('val is set to undefined', () => {
            const val: any = undefined;
            it('isEmpty() should be true', () => {
                expect(isEmpty(val)).toBeTruthy();
            });
        });

        describe('val is set to null', () => {
            const val: any = null;
            it('isEmpty() should be true', () => {
                expect(isEmpty(val)).toBeTruthy();
            });
        });

        describe('val is set to 0', () => {
            const val: any = 0;
            it('isEmpty() should be false', () => {
                expect(isEmpty(val)).toBeFalsy();
            });
        });

        describe('val is set to ""', () => {
            const val: any = '';
            it('isEmpty() should be true', () => {
                expect(isEmpty(val)).toBeTruthy();
            });
        });

        describe('val is set to {}', () => {
            const val: any = {};
            it('isEmpty() should be true', () => {
                expect(isEmpty(val)).toBeTruthy();
            });
        });

        describe('val is set to {id:1}', () => {
            const val: any = {id: 1};
            it('isEmpty() should be false', () => {
                expect(isEmpty(val)).toBeFalsy();
            });
        });

    });

    describe('isEqual()', () => {

        describe('src is set to "1" and target is set to "1"', () => {
            const src: any = '1';
            const target: any = '1';
            it('isEqual() should be true', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to "1" and target is set to "2"', () => {
            const src: any = '1';
            const target: any = '2';
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to "1" and target is set to 1', () => {
            const src: any = '1';
            const target: any = 1;
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to 1 and target is set to 1', () => {
            const src: any = 1;
            const target: any = 1;
            it('isEqual() should be true', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to 1 and target is set to 2', () => {
            const src: any = 1;
            const target: any = 2;
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to true and target is set to true', () => {
            const src: any = true;
            const target: any = true;
            it('isEqual() should be true', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to true and target is set to true', () => {
            const src: any = true;
            const target: any = false;
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to {id:1} and target is set to {id:1}', () => {
            const src: any = {id: 1};
            const target: any = {id: 1};
            it('isEqual() should be true', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to undefined and target is set to undefined', () => {
            const src: any = undefined;
            const target: any = undefined;
            it('isEqual() should be true', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to undefined and target is set to null', () => {
            const src: any = undefined;
            const target: any = null;
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to null and target is set to null', () => {
            const src: any = null;
            const target: any = null;
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to {id:1} and target is set to {id:"1"}', () => {
            const src: any = {id: 1};
            const target: any = {id: '1'};
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to {id:1} and target is set to {id:2}', () => {
            const src: any = {id: 1};
            const target: any = {id: 2};
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to {id:1, name:"A"} and target is set to {id:2}', () => {
            const src: any = {id: 1, name: 'A'};
            const target: any = {id: 2};
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to {time: new Date()} and target is set to {time: new Date()}', () => {
            const src: any = {time: new Date()};
            const target: any = {time: new Date()};
            it('isEqual() should be true', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to {time: new Date(1497976023529)} and target is set to {time: new Date()}', () => {
            const src: any = {time: new Date(1497976023529)};
            const target: any = {time: new Date()};
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to {list: [1,"2",{id:3}]} and target is set to {time: list:[1,"2",{id:3}}', () => {
            const src: any = {list: [1, '2', {id: 3}]};
            const target: any = {list: [1, '2', {id: 3}]};
            it('isEqual() should be true', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to {list: [1,"2",{id:3}]} and target is set to {time: list:[1,"2",{id:4}}', () => {
            const src: any = {list: [1, '2', {id: 3}]};
            const target: any = {list: [1, '2', {id: 4}]};
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

    });

//}
