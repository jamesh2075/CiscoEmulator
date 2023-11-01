import {property} from './property';

//export function main() {

    describe('property()', () => {

        const data: any = {
            id: 1,
            arr: [1, 2, {
                name: 'My Name'
            }],
            obj: {
                name: 'Object'
            }
        };

        const json = JSON.stringify(data);

        const prop = property(data);

        describe('property(' + json + ')', () => {
            it('.get("id") to be 1', () => {
                const val = prop.get('id');
                expect(val).toBe(1);
            });
        });

        describe('property(' + json + ')', () => {
            it('.get("obj.name") to be "Object"', () => {
                const val = prop.get('obj.name');
                expect(val).toBe('Object');
            });
        });

        describe('property(' + json + ')', () => {
            it('.get("arr[2].name") to be "My Name"', () => {
                const val = prop.get('arr[2].name');
                expect(val).toBe('My Name');
            });
        });

        describe('property(' + json + ')', () => {
            it('.get("arr[\'2\'].name") to be "My Name"', () => {
                const val = prop.get(`arr['2'].name`);
                expect(val).toBe('My Name');
            });
        });

        describe('property(' + json + ')', () => {
            it('.get("obj.name") to be "Object"', () => {
                const val = prop.get('obj.name');
                expect(val).toBe('Object');
            });
        });

        describe('property(' + json + ')', () => {
            it('.get("arr.2.name") to be "My Name"', () => {
                const val = prop.get('arr.2.name');
                expect(val).toBe('My Name');
            });
        });

        describe('property(' + json + ').set("a.b.c", 123)', () => {
            it('a.b.c to be 123', () => {
                prop.set('a.b.c', 123);
                expect(data.a.b.c).toBe(123);
            });
        });
    });

//}
