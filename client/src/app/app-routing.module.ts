import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SectorViewComponent } from './zoom-levels/sector-view/sector-view.component';
import { PlanetViewComponent } from './zoom-levels/planet-view/planet-view.component';
import { SystemViewComponent } from './zoom-levels/system-view/system-view.component';

const routes: Routes = [
 { path: 'sector', component: SectorViewComponent},
 { path: 'sector/:systemName', component: SystemViewComponent},
 { path: 'planet', component: PlanetViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }