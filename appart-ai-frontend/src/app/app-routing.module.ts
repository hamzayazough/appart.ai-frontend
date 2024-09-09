import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing-page/landing-page.component';
import { AccountPageComponent } from './pages/account/account-page/account-page.component';
import { AccountHobbiesComponent } from './pages/account/account-page/shared-components/account-hobbies/account-hobbies.component';
import { AccountContactsComponent } from './pages/account/account-page/shared-components/account-contacts/account-contacts.component';
import { MapPageComponent } from './pages/map/map-page/map-page.component';
const routes: Routes = [
  { path: 'home', component: LandingPageComponent },
  { path: 'account/:id', component: AccountPageComponent },
  { path: 'account/:id/contacts', component: AccountContactsComponent },
  { path: 'account/:id/hobbies', component: AccountHobbiesComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
  { path: 'map', component: MapPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
