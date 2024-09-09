import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPageComponent } from './map-page/map-page.component';
import { ApartmentCardComponent } from './apartment-card/apartment-card.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { accessToken } from '../../../assets/tokens/maps';

@NgModule({
  declarations: [MapPageComponent, ApartmentCardComponent],
  imports: [
    CommonModule,
    NgxMapboxGLModule.withConfig({
      accessToken: accessToken, // Optional, can also be set per map (accessToken input of mgl-map)
    }),
  ],
})
export class MapModule {}
