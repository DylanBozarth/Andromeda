import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GalaticViewComponent } from './galatic-view/galatic-view.component';

const routes: Routes = [
 { path: 'galatic', component: GalaticViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
