import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing-page/landing-page.component';
import { AccountPageComponent } from './pages/account/account-page/account-page.component';
import { AccountContactsComponent } from './pages/account/account-page/shared-components/account-contacts/account-contacts.component';
import { MapPageComponent } from './pages/map/map-page/map-page.component';
import { AccommodationManagementPageComponent } from './pages/accommodation-management-page/accommodation-management-page.component';
import { AccommodationPageComponent } from './pages/accommodation-page/accommodation-page.component';
import { MySavedAccommodationsComponent } from './pages/account/account-page/shared-components/saved-accommodations/my-saved-accommodations/my-saved-accommodations.component';
import { AccountPreferencesComponent } from './pages/account/account-page/shared-components/account-preferences/account-preferences.component';
import { RoommatesPageComponent } from './pages/roomates-research/roomates-page/roommates-page.component';
import { RoommateSearchingComponent } from './pages/roomates-research/roomates-page/roommate-searching/roommate-searching.component';
import { CreateRoommateRequestComponent } from './pages/roomates-research/roomates-page/create-roommate-request/create-roommate-request.component';
import { authGuard } from './auth.guard';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';

const routes: Routes = [
  { path: 'home', component: LandingPageComponent },
  { path: 'register', component: RegistrationPageComponent },

  {
    path: 'r',
    component: RoommatesPageComponent, canActivate: [authGuard],
    children: [
      { path: 'create-post', component: CreateRoommateRequestComponent },
      { path: 'research', component: RoommateSearchingComponent },
      { path: 'research/:id', component: RoommateSearchingComponent }
    ]
  },
  { path: 'account/:id', component: AccountPageComponent, canActivate: [authGuard] },
  { path: 'account/:id/r', component: AccountContactsComponent, canActivate: [authGuard]},
  { path: 'account/:id/contacts', component: AccountContactsComponent, canActivate: [authGuard] },
  { path: 'account/:id/saved-accommodations', component: MySavedAccommodationsComponent, canActivate: [authGuard]},
  { path: 'account/:id/accommodations-manager', component: AccommodationManagementPageComponent, canActivate: [authGuard] },
  { path: 'account/:id/preferences', component: AccountPreferencesComponent, canActivate: [authGuard] },
  { path: 'map', component: MapPageComponent },
  { path: 'accommodation/:accommodationId', component: AccommodationPageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
