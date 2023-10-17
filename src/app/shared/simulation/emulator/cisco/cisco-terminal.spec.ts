import {Simulation} from '../../simulation';
import {SimulationFactory} from '../../simulation.factory';
import {SimICND2} from '../../exam/icnd2';

export function main() {

    xdescribe('autocomplete unit test', () => {
        beforeEach((done) => {
        });
        it('autocompletes', () => {
            const simulation: Simulation = SimulationFactory.load(SimICND2);
            simulation.getDevice('SW1');
            expect(1).toEqual(1);
        });

    });

}
