import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing-page/landing-page.component';
import { MapPageComponent } from './pages/map/map-page/map-page.component';
const routes: Routes = [
  { path: 'home', component: LandingPageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'map', component: MapPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
