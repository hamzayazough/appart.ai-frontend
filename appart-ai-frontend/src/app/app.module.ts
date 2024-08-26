import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './pages/landing/landing-page/landing-page.component';
import { LandingHeaderComponent } from './pages/landing/landing-header/landing-header.component';
import { GradientButtonComponent } from './shared/gradient-button/gradient-button.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LandingHeaderComponent,
    GradientButtonComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
