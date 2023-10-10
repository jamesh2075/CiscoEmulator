import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { SimulationComponent } from './home/simulation.component';
import { SimulationComponent} from './simulator/simulator.component'
import { CommandsComponent } from './commands/commands.component';

const routes: Routes = [
  { path: '', redirectTo: '/simulator', pathMatch: 'full' },
  { path: 'simulator', component: SimulationComponent },
  { path: 'commands', component: CommandsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
