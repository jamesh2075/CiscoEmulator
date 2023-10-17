import {diff} from './diff';
export function main() {

    describe('diff()', () => {
        describe('diff({a: 1}, {a: 1})', () => {
            const target: any = {a: 1};
            const source: any = {a: 1};

            it('expect to be null', () => {
                const result = diff(target, source);
                expect(result).toBe(null);
            });
        });

        describe('diff({a: 1}, {a: 2})', () => {
            const target: any = {a: 1};
            const source: any = {a: 2};

            it('expect to be {a: 1}', () => {
                const result = diff(target, source);
                expect(result).toEqual({a: 1});
            });
        });

        describe('diff([1,2,3], [1,2,3])', () => {
            const target: any = [1, 2, 3];
            const source: any = [1, 2, 3];

            it('expect to be null', () => {
                const result = diff(target, source);
                expect(result).toEqual(null);
            });
        });

        describe('diff([1,2,3], [1,2,10])', () => {
            const target: any = [1, 2, 3];
            const source: any = [1, 2, 10];

            it('expect to be {2:3}', () => {
                const result = diff(target, source);
                expect(result).toEqual({2: 3});
            });
        });

        describe('diff({name: "target", list: ["a", "b", "c"]}, {name: "source", list: ["a", "b", "c", "d"]})', () => {
            const target: any = {name: 'target', list: ['a', 'b', 'c']};
            const source: any = {name: 'source', list: ['a', 'b', 'c', 'd']};

            it('expect to be {name: "target", list: ["a", "b", "c"]}', () => {
                const result = diff(target, source);
                expect(result).toEqual({name: 'target', list: ['a', 'b', 'c']});
            });
        });

        describe('diff({name: "target", list: ["a", "b", "c", "d"]}, {name: "source", list: ["a", "b", "c"]})', () => {
            const target: any = {name: 'target', list: ['a', 'b', 'c', 'd']};
            const source: any = {name: 'source', list: ['a', 'b', 'c']};

            it('expect to be {name: "target", list: ["a", "b", "c", "d"]}', () => {
                const result = diff(target, source);
                expect(result).toEqual({name: 'target', list: ['a', 'b', 'c', 'd']});
            });
        });

        describe('diff({name: "target", $class: "MyClass"}, {name: "source", $class: "MyClass"})', () => {
            const target: any = {name: 'MyName', $class: 'MyClass'};
            const source: any = {name: 'MyName', $class: 'MyClass'};

            it('expect to be {$class: "MyClass"}', () => {
                const result = diff(target, source);
                expect(result).toEqual({$class: 'MyClass'});
            });
        });

        // excludeEmptyClasses = true
        describe('Removes empty class => diff({name: "target", $class: "MyClass"}, {name: "source", $class: "MyClass"}, true)', () => {
            const target: any = {name: 'MyName', $class: 'MyClass'};
            const source: any = {name: 'MyName', $class: 'MyClass'};

            it('expect to be null', () => {
                const result = diff(target, source, true);
                expect(result).toEqual(null);
            });
        });

        // excludeEmptyClasses = true
        describe('Removes empty class => diff({name: "target", $class: "MyClass1"}, {name: "source", $class: "MyClass2"}, true)', () => {
            const target: any = {name: 'MyName', $class: 'MyClass1'};
            const source: any = {name: 'MyName', $class: 'MyClass2'};

            it('expect to be null', () => {
                const result = diff(target, source, true);
                expect(result).toEqual(null);
            });
        });

        describe('diff({name: "target", $class: "MyClass"}, {name: "source", $class: "MyClass"})', () => {
            const target: any = {name: 'target', $class: 'MyClass'};
            const source: any = {name: 'source', $class: 'MyClass'};

            it('expect to be {name: "target", $class: "MyClass"}', () => {
                const result = diff(target, source);
                expect(result).toEqual({name: 'target', $class: 'MyClass'});
            });
        });


        describe('diff({name: "target", _snapshot: {name: "original"}})', () => {
            const target: any = {name: 'target', _snapshot: {name: 'original'}};
            const source: any = {name: 'source'};

            it('expect to be {name: "target"}', () => {
                const result = diff(target, source);
                expect(result).toEqual({name: 'target'});
            });
        });

        describe('diff({name: "target", $defaultValues: {name: "original"}})', () => {
            const target: any = {name: 'target', $defaultValues: {name: 'original'}};
            const source: any = {name: 'source', $defaultValues: {name: 'original'}};

            it('expect to be null', () => {
                const result = diff(target, source);
                expect(result).toEqual({name: 'target', $defaultValues: {name: 'original'}});
            });
        });
    });
}
