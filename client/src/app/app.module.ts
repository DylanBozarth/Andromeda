import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SectorViewComponent } from './zoom-levels/sector-view/sector-view.component';
import { SystemViewComponent } from './zoom-levels/system-view/system-view.component';
import { PlanetViewComponent } from './zoom-levels/planet-view/planet-view.component';
import { UserNavigationInterfaceComponent } from './components/user-navigation-interface/user-navigation-interface.component';

@NgModule({
  declarations: [
    AppComponent,
    SectorViewComponent,
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
