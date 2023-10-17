import {Vlan} from './vlan.model';
export function main() {

    describe('new Vlan()', () => {
        const vlan = new Vlan();

        it('vlan diff should be empty', () => {
            expect(vlan.serialize(true)).toEqual({$class: 'Vlan'});
        });
    });

    describe('assigned an ID on new Vlan()', () => {
        const vlan = new Vlan();
        vlan.id = 10;

        it('vlan diff should include ID', () => {
            expect(vlan.serialize(true)).toEqual({$class: 'Vlan', id: 10, name: 'VLAN0010'});
        });
    });

    describe('assigned an defaultValues on new Vlan()', () => {
        const vlan = new Vlan();
        vlan.setDefaultValues({
            status: 'inactive'
        });
        vlan.status = 'active';

        it('vlan diff should include $defaultValues', () => {
            expect(vlan.serialize(true)).toEqual({
                $class: 'Vlan',
                status: 'active',
                $defaultValues: {
                    status: 'inactive'
                }});
        });
    });
}
