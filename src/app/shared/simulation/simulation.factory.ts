import {Simulation} from './simulation';
import {SimDefinition} from './sim-definition';

export class SimulationFactory {

    static load(data: SimDefinition): Simulation {
        let simulation = new Simulation();
        simulation.setupModel(data);
        return simulation;
    }

    private static _simulation: Simulation;

    static getSimulation() {
        if (!SimulationFactory._simulation) {
            SimulationFactory._simulation = new Simulation();
        }
        return SimulationFactory._simulation;
    }

}
