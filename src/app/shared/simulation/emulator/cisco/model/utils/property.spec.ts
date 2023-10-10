import {property} from "./property";

export function main() {

    describe('property()', () => {

        let data: any = {
            id: 1,
            arr: [1, 2, {
                name: "My Name"
            }],
            obj: {
                name: 'Object'
            }
        };

        let json = JSON.stringify(data);

        let prop = property(data);

        describe('property(' + json + ')', () => {
            it('.get("id") to be 1', () => {
                let val = prop.get("id");
                expect(val).toBe(1);
            });
        });

        describe('property(' + json + ')', () => {
            it('.get("obj.name") to be "Object"', () => {
                let val = prop.get("obj.name");
                expect(val).toBe("Object");
            });
        });

        describe('property(' + json + ')', () => {
            it('.get("arr[2].name") to be "My Name"', () => {
                let val = prop.get("arr[2].name");
                expect(val).toBe("My Name");
            });
        });

        describe('property(' + json + ')', () => {
            it('.get("arr[\'2\'].name") to be "My Name"', () => {
                let val = prop.get("arr['2'].name");
                expect(val).toBe("My Name");
            });
        });

        describe('property(' + json + ')', () => {
            it('.get("obj.name") to be "Object"', () => {
                let val = prop.get("obj.name");
                expect(val).toBe("Object");
            });
        });

        describe('property(' + json + ')', () => {
            it('.get("arr.2.name") to be "My Name"', () => {
                let val = prop.get("arr.2.name");
                expect(val).toBe("My Name");
            });
        });

        describe('property(' + json + ').set("a.b.c", 123)', () => {
            it('a.b.c to be 123', () => {
                prop.set("a.b.c", 123);
                expect(data.a.b.c).toBe(123);
            });
        });
    });

}