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
import { RoomatesPageComponent } from './pages/roomates-research/roomates-page/roomates-page.component';
import { RoommateSearchingComponent } from './pages/roomates-research/roomates-page/roommate-searching/roommate-searching.component';
import { EditRoommateRequestComponent } from './pages/roomates-research/roomates-page/edit-roommate-request/edit-roommate-request.component';
import { CreateRoommateRequestComponent } from './pages/roomates-research/roomates-page/create-roommate-request/create-roommate-request.component';
const routes: Routes = [
  { path: 'home', component: LandingPageComponent },
  {
    path: 'r',
    component: RoomatesPageComponent,
    children: [
      { path: 'create-post', component: CreateRoommateRequestComponent },
      { path: 'edit/:id', component: EditRoommateRequestComponent },
      { path: 'research/:id', component: RoommateSearchingComponent }
    ]
  },
  { path: 'account/:id', component: AccountPageComponent },
  { path: 'account/:id/r', component: AccountContactsComponent },
  { path: 'account/:id/contacts', component: AccountContactsComponent },
  { path: 'account/:id/saved-accommodations', component: MySavedAccommodationsComponent},
  { path: 'account/:id/accommodations-manager', component: AccommodationManagementPageComponent },
  { path: 'account/:id/preferences', component: AccountPreferencesComponent },
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
