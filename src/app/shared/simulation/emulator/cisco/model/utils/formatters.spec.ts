import {toJSONObject} from "./formatters";
export function main() {

    describe('formatters()', () => {

        describe('toJSONObject({id: 1})', () => {
            it('expect to be {id:1}', () => {
                let json = toJSONObject({id: 1});
                expect(json).toEqual({id: 1});
            });
        });

        describe('toJSONObject(1)', () => {
            it('expect to be null', () => {
                let json = toJSONObject(1);
                expect(json).toBe(1);
            });
        });

        describe('toJSONObject(true)', () => {
            it('expect to be null', () => {
                let json = toJSONObject(true);
                expect(json).toBe(true);
            });
        });

        describe('toJSONObject("")', () => {
            it('expect to be ""', () => {
                let json = toJSONObject("");
                expect(json).toBe("");
            });
        });

        describe('toJSONObject(null)', () => {
            it('expect to be null', () => {
                let json = toJSONObject(null);
                expect(json).toBe(null);
            });
        });

        describe('toJSONObject(undefined)', () => {
            it('expect to be undefined', () => {
                let json = toJSONObject(undefined);
                expect(json).toBe(undefined);
            });
        });

        describe('toJSONObject({_snapshot:true, id: 1})', () => {
            it('expect to be {id:1}', () => {
                let json = toJSONObject({_snapshot: true, id: 1});
                expect(json).toEqual({_snapshot: true, id: 1});
            });
        });

        describe('toJSONObject({_snapshot:true, id: 1})', () => {
            it('expect to be {id:1}', () => {
                let json = toJSONObject({_snapshot: true, id: 1}, true);
                expect(json).toEqual({id: 1});
            });
        });
    });

}