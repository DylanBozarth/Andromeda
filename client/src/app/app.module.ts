import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GalaticViewComponent } from './galatic-view/galatic-view.component';
import { SystemViewComponent } from './system-view/system-view.component';
import { PlanetViewComponent } from './planet-view/planet-view.component';
import { UserNavigationInterfaceComponent } from './components/user-navigation-interface/user-navigation-interface.component';

@NgModule({
  declarations: [
    AppComponent,
    GalaticViewComponent,
    SystemViewComponent,
    PlanetViewComponent,
    UserNavigationInterfaceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
