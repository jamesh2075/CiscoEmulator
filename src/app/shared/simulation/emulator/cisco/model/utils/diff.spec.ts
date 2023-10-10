import {diff} from "./diff";
export function main() {

    describe('diff()', () => {
        describe('diff({a: 1}, {a: 1})', () => {
            let target: any = {a: 1};
            let source: any = {a: 1};

            it('expect to be null', () => {
                let result = diff(target, source);
                expect(result).toBe(null);
            });
        });

        describe('diff({a: 1}, {a: 2})', () => {
            let target: any = {a: 1};
            let source: any = {a: 2};

            it('expect to be {a: 1}', () => {
                let result = diff(target, source);
                expect(result).toEqual({a: 1});
            });
        });

        describe('diff([1,2,3], [1,2,3])', () => {
            let target: any = [1, 2, 3];
            let source: any = [1, 2, 3];

            it('expect to be null', () => {
                let result = diff(target, source);
                expect(result).toEqual(null);
            });
        });

        describe('diff([1,2,3], [1,2,10])', () => {
            let target: any = [1, 2, 3];
            let source: any = [1, 2, 10];

            it('expect to be {2:3}', () => {
                let result = diff(target, source);
                expect(result).toEqual({2: 3});
            });
        });

        describe('diff({name: "target", list: ["a", "b", "c"]}, {name: "source", list: ["a", "b", "c", "d"]})', () => {
            let target: any = {name: "target", list: ["a", "b", "c"]};
            let source: any = {name: "source", list: ["a", "b", "c", "d"]};

            it('expect to be {name: "target", list: ["a", "b", "c"]}', () => {
                let result = diff(target, source);
                expect(result).toEqual({name: "target", list: ["a", "b", "c"]});
            });
        });

        describe('diff({name: "target", list: ["a", "b", "c", "d"]}, {name: "source", list: ["a", "b", "c"]})', () => {
            let target: any = {name: "target", list: ["a", "b", "c", "d"]};
            let source: any = {name: "source", list: ["a", "b", "c"]};

            it('expect to be {name: "target", list: ["a", "b", "c", "d"]}', () => {
                let result = diff(target, source);
                expect(result).toEqual({name: "target", list: ["a", "b", "c", "d"]});
            });
        });

        describe('diff({name: "target", $class: "MyClass"}, {name: "source", $class: "MyClass"})', () => {
            let target: any = {name: "MyName", $class: "MyClass"};
            let source: any = {name: "MyName", $class: "MyClass"};

            it('expect to be {$class: "MyClass"}', () => {
                let result = diff(target, source);
                expect(result).toEqual({$class: "MyClass"});
            });
        });

        // excludeEmptyClasses = true
        describe('Removes empty class => diff({name: "target", $class: "MyClass"}, {name: "source", $class: "MyClass"}, true)', () => {
            let target: any = {name: "MyName", $class: "MyClass"};
            let source: any = {name: "MyName", $class: "MyClass"};

            it('expect to be null', () => {
                let result = diff(target, source, true);
                expect(result).toEqual(null);
            });
        });

        // excludeEmptyClasses = true
        describe('Removes empty class => diff({name: "target", $class: "MyClass1"}, {name: "source", $class: "MyClass2"}, true)', () => {
            let target: any = {name: "MyName", $class: "MyClass1"};
            let source: any = {name: "MyName", $class: "MyClass2"};

            it('expect to be null', () => {
                let result = diff(target, source, true);
                expect(result).toEqual(null);
            });
        });

        describe('diff({name: "target", $class: "MyClass"}, {name: "source", $class: "MyClass"})', () => {
            let target: any = {name: "target", $class: "MyClass"};
            let source: any = {name: "source", $class: "MyClass"};

            it('expect to be {name: "target", $class: "MyClass"}', () => {
                let result = diff(target, source);
                expect(result).toEqual({name: "target", $class: "MyClass"});
            });
        });


        describe('diff({name: "target", _snapshot: {name: "original"}})', () => {
            let target: any = {name: "target", _snapshot: {name: "original"}};
            let source: any = {name: "source"};

            it('expect to be {name: "target"}', () => {
                let result = diff(target, source);
                expect(result).toEqual({name: "target"});
            });
        });

        describe('diff({name: "target", $defaultValues: {name: "original"}})', () => {
            let target: any = {name: "target", $defaultValues: {name: "original"}};
            let source: any = {name: "source", $defaultValues: {name: "original"}};

            it('expect to be null', () => {
                let result = diff(target, source);
                expect(result).toEqual({name: "target", $defaultValues: {name: "original"}});
            });
        });
    });
}
