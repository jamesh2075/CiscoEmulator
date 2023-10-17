import {Simulation} from './simulation';
import {SimDefinition} from './sim-definition';

export class SimulationFactory {

    private static _simulation: Simulation;

    static load(data: SimDefinition): Simulation {
        const simulation = new Simulation();
        simulation.setupModel(data);
        return simulation;
    }

    static getSimulation() {
        if (!SimulationFactory._simulation) {
            SimulationFactory._simulation = new Simulation();
        }
        return SimulationFactory._simulation;
    }

}
