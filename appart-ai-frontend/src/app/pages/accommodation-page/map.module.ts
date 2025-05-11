import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApartmentCardComponent } from '../map/apartment-card/apartment-card.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { accessToken } from '../../../assets/tokens/maps';
import { MapSidebarComponent } from '../map/map-sidebar/map-sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatchingApartmentCardComponent } from '../matching-map-page/matching-apartment-card/matching-apartment-card.component';
import { MatchingMapPageComponent } from '../matching-map-page/matching-map-page.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ApartmentCardComponent,
    MapSidebarComponent,
    MatchingApartmentCardComponent,
    MatchingMapPageComponent,
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxMapboxGLModule.withConfig({
      accessToken: accessToken, // Optional, can also be set per map (accessToken input of mgl-map)
    }),
    SharedModule,
  ],
})
export class MapModule {}
