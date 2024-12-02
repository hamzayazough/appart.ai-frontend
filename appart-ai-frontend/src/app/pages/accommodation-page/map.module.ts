import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPageComponent } from '../map/map-page/map-page.component';
import { ApartmentCardComponent } from '../map/apartment-card/apartment-card.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { accessToken } from '../../../assets/tokens/maps';
import { MapSidebarComponent } from '../map/map-sidebar/map-sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MapPageComponent, ApartmentCardComponent, MapSidebarComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    NgxMapboxGLModule.withConfig({
      accessToken: accessToken, // Optional, can also be set per map (accessToken input of mgl-map)
    }),
    SharedModule,
  ],
})
export class MapModule {}
