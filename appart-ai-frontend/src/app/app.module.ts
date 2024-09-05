import { NgModule } from '@angular/core';
import {
  BrowserModule,
  HammerModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './pages/landing/landing-page/landing-page.component';
import { LandingHeaderComponent } from './pages/landing/landing-header/landing-header.component';
import { SharedModule } from './shared/shared.module';
import { AccountPageComponent } from './pages/account/account-page/account-page.component';

@NgModule({
  declarations: [AppComponent, LandingPageComponent, LandingHeaderComponent, AccountPageComponent],
  imports: [BrowserModule, AppRoutingModule, SharedModule, HammerModule],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
