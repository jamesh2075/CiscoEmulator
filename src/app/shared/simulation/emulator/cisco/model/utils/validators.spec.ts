import {isArray, isDate, isEmpty, isEqual, isObject, isString, isUndefined} from "./validators";

export function main() {

    describe('val is declared but not defined', () => {
        let val: any;
        it('isUndefined() should be true', () => {
            expect(isUndefined(val)).toBeTruthy();
        });
    });

    describe('val is set to new Date()', () => {
        let val = new Date();
        it('isDate() should be true', () => {
            expect(isDate(val)).toBeTruthy();
        });
    });

    describe('val is set to []', () => {
        let val: any = [];
        it('isArray() should be true', () => {
            expect(isArray(val)).toBeTruthy();
        });
    });

    describe('val is set to {}', () => {
        let val: any = {};
        it('isObject() should be true', () => {
            expect(isObject(val)).toBeTruthy();
        });
    });

    describe('val is set to ""', () => {
        let val: any = "";
        it('isString() should be true', () => {
            expect(isString(val)).toBeTruthy();
        });
    });

    describe('isEmpty()', () => {

        describe('val is set to undefined', () => {
            let val: any;
            it('isEmpty() should be true', () => {
                expect(isEmpty(val)).toBeTruthy();
            });
        });

        describe('val is set to null', () => {
            let val: any;
            it('isEmpty() should be true', () => {
                expect(isEmpty(val)).toBeTruthy();
            });
        });

        describe('val is set to 0', () => {
            let val: any;
            it('isEmpty() should be false', () => {
                expect(isEmpty(val)).toBeTruthy();
            });
        });

        describe('val is set to ""', () => {
            let val: any;
            it('isEmpty() should be true', () => {
                expect(isEmpty(val)).toBeTruthy();
            });
        });

        describe('val is set to {}', () => {
            let val: any = {};
            it('isEmpty() should be true', () => {
                expect(isEmpty(val)).toBeTruthy();
            });
        });

        describe('val is set to {id:1}', () => {
            let val: any = {id:1};
            it('isEmpty() should be false', () => {
                expect(isEmpty(val)).toBeFalsy();
            });
        });

    });

    describe('isEqual()', () => {

        describe('src is set to "1" and target is set to "1"', () => {
            let src: any = "1";
            let target: any = "1";
            it('isEqual() should be true', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to "1" and target is set to "2"', () => {
            let src: any = "1";
            let target: any = "2";
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to "1" and target is set to 1', () => {
            let src: any = "1";
            let target: any = 1;
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to 1 and target is set to 1', () => {
            let src: any = 1;
            let target: any = 1;
            it('isEqual() should be true', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to 1 and target is set to 2', () => {
            let src: any = 1;
            let target: any = 2;
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to true and target is set to true', () => {
            let src: any = true;
            let target: any = true;
            it('isEqual() should be true', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to true and target is set to true', () => {
            let src: any = true;
            let target: any = false;
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to {id:1} and target is set to {id:1}', () => {
            let src: any = {id: 1};
            let target: any = {id: 1};
            it('isEqual() should be true', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to undefined and target is set to undefined', () => {
            let src: any;
            let target: any;
            it('isEqual() should be true', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to undefined and target is set to null', () => {
            let src: any;
            let target: any = null;
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to null and target is set to null', () => {
            let src: any = null;
            let target: any = null;
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to {id:1} and target is set to {id:"1"}', () => {
            let src: any = {id: 1};
            let target: any = {id: "1"};
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to {id:1} and target is set to {id:2}', () => {
            let src: any = {id: 1};
            let target: any = {id: 2};
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to {id:1, name:"A"} and target is set to {id:2}', () => {
            let src: any = {id: 1, name: "A"};
            let target: any = {id: 2};
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to {time: new Date()} and target is set to {time: new Date()}', () => {
            let src: any = {time: new Date()};
            let target: any = {time: new Date()};
            it('isEqual() should be true', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to {time: new Date(1497976023529)} and target is set to {time: new Date()}', () => {
            let src: any = {time: new Date(1497976023529)};
            let target: any = {time: new Date()};
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

        describe('src is set to {list: [1,"2",{id:3}]} and target is set to {time: list:[1,"2",{id:3}}', () => {
            let src: any = {list: [1, "2", {id: 3}]};
            let target: any = {list: [1, "2", {id: 3}]};
            it('isEqual() should be true', () => {
                expect(isEqual(src, target)).toBeTruthy();
            });
        });

        describe('src is set to {list: [1,"2",{id:3}]} and target is set to {time: list:[1,"2",{id:4}}', () => {
            let src: any = {list: [1, "2", {id: 3}]};
            let target: any = {list: [1, "2", {id: 4}]};
            it('isEqual() should be false', () => {
                expect(isEqual(src, target)).toBeFalsy();
            });
        });

    });

}