import {toJSONObject} from './formatters';
export function main() {

    describe('formatters()', () => {

        describe('toJSONObject({id: 1})', () => {
            it('expect to be {id:1}', () => {
                const json = toJSONObject({id: 1});
                expect(json).toEqual({id: 1});
            });
        });

        describe('toJSONObject(1)', () => {
            it('expect to be null', () => {
                const json = toJSONObject(1);
                expect(json).toBe(1);
            });
        });

        describe('toJSONObject(true)', () => {
            it('expect to be null', () => {
                const json = toJSONObject(true);
                expect(json).toBe(true);
            });
        });

        describe('toJSONObject("")', () => {
            it('expect to be ""', () => {
                const json = toJSONObject('');
                expect(json).toBe('');
            });
        });

        describe('toJSONObject(null)', () => {
            it('expect to be null', () => {
                const json = toJSONObject(null);
                expect(json).toBe(null);
            });
        });

        describe('toJSONObject(undefined)', () => {
            it('expect to be undefined', () => {
                const json = toJSONObject(undefined);
                expect(json).toBe(undefined);
            });
        });

        describe('toJSONObject({_snapshot:true, id: 1})', () => {
            it('expect to be {id:1}', () => {
                const json = toJSONObject({_snapshot: true, id: 1});
                expect(json).toEqual({_snapshot: true, id: 1});
            });
        });

        describe('toJSONObject({_snapshot:true, id: 1})', () => {
            it('expect to be {id:1}', () => {
                const json = toJSONObject({_snapshot: true, id: 1}, true);
                expect(json).toEqual({id: 1});
            });
        });
    });

}
