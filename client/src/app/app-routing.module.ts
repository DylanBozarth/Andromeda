import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GalaticViewComponent } from './zoom-levels/galatic-view/galatic-view.component';
import { PlanetViewComponent } from './zoom-levels/planet-view/planet-view.component';
import { SystemViewComponent } from './zoom-levels/system-view/system-view.component';

const routes: Routes = [
 { path: 'galatic', component: GalaticViewComponent},
 { path: 'system', component: SystemViewComponent},
 { path: 'planet', component: PlanetViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }