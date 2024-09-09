import { NgModule } from '@angular/core';
import {
  BrowserModule,
  HammerModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { AuthModule } from '@auth0/auth0-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './pages/landing/landing-page/landing-page.component';
import { LandingHeaderComponent } from './pages/landing/landing-header/landing-header.component';
import { SharedModule } from './shared/shared.module';
import { AuthButtonComponent } from './pages/landing/landing-header/components/auth-button/auth-button.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AccountPageComponent } from './pages/account/account-page/account-page.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material/material.module';
import { AccountPersonalInfoComponent } from './pages/account/account-page/shared-components/account-personal-info/account-personal-info.component';
import { AccountContactsComponent } from './pages/account/account-page/shared-components/account-contacts/account-contacts.component';
import { AccountHobbiesComponent } from './pages/account/account-page/shared-components/account-hobbies/account-hobbies.component';
import { ConversationsPageComponent } from './pages/conversations-page/conversations-page.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, LandingPageComponent, LandingHeaderComponent, AuthButtonComponent, AccountPageComponent, AccountPersonalInfoComponent, AccountContactsComponent, AccountHobbiesComponent, ConversationsPageComponent],
  imports: [BrowserModule, AppRoutingModule, SharedModule, HammerModule, MaterialModule, FormsModule,
    CommonModule,
    AuthModule.forRoot({
    domain: 'dev-8cn4ee7fnjylxcsz.us.auth0.com',
    clientId: 'RLU5dSYynQfFsVWfKtnoBmgpjqug8mEw',
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  }),
  HttpClientModule],
  providers: [provideClientHydration(), provideAnimationsAsync()],
  bootstrap: [AppComponent],
})

export class AppModule {}
