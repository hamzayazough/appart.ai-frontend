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
import { ConversationsPageComponent } from './pages/conversations-page/conversations-page.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AccommodationManagementPageComponent } from './pages/accommodation-management-page/accommodation-management-page.component';
import { AccommodationCreationDialogComponent } from './pages/accommodation-management-page/dialog-components/accommodation-creation-dialog/accommodation-creation-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddressAutocompleteComponent } from './pages/accommodation-management-page/address-autocomplete/address-autocomplete.component';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { AccommodationPageComponent } from './pages/accommodation-page/accommodation-page.component';
import { InterestedPeopleDialogComponent } from './dialogs/interested-people-dialog/interested-people-dialog.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { accessToken } from '../assets/tokens/maps';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AccommodationMapComponent } from './pages/accommodation-page/accommodation-map/accommodation-map.component';
import { MapModule } from './pages/accommodation-page/map.module';
import { AccountPreferencesComponent } from './pages/account/account-page/shared-components/account-preferences/account-preferences.component';
import { MySavedAccommodationsComponent } from './pages/account/account-page/shared-components/saved-accommodations/my-saved-accommodations/my-saved-accommodations.component';
import { SuccessDialogComponent } from './pages/account/dialogs/success-dialog/success-dialog.component';
import { ContactLandLordComponent } from './pages/accommodation-management-page/dialog-components/contact-land-lord/contact-land-lord.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LandingHeaderComponent,
    AuthButtonComponent,
    AccountPageComponent,
    AccountPersonalInfoComponent,
    AccountContactsComponent,
    ConversationsPageComponent,
    AccommodationManagementPageComponent,
    AccommodationCreationDialogComponent,
    AddressAutocompleteComponent,
    AccommodationPageComponent,
    InterestedPeopleDialogComponent,
    AccommodationMapComponent,
    AccountPreferencesComponent,
    MySavedAccommodationsComponent,
    SuccessDialogComponent,
    ContactLandLordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HammerModule,
    MaterialModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    MatOptionModule,
    MatGridListModule,
    MatDividerModule,
    MapModule,
    AuthModule.forRoot({
      domain: 'dev-8cn4ee7fnjylxcsz.us.auth0.com',
      clientId: 'RLU5dSYynQfFsVWfKtnoBmgpjqug8mEw',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
    MatSidenavModule,
    NgxMapboxGLModule.withConfig({
      accessToken: accessToken,
    }),
    HttpClientModule,
  ],
  providers: [provideClientHydration(), provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
