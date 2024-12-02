import { Component, ViewChild } from '@angular/core';
import { Feature } from 'geojson';
import { PointLike } from 'mapbox-gl';
import { parseGeoJson } from '../../../shared/utils/geoJson.util';
import { AccommodationsService } from '../../../services/accomodations/accomodations.service';
import { PinClass } from './pinClass';
import { MapSidebarComponent } from '../map-sidebar/map-sidebar.component';
import { AccommodationMatchingDTO } from '../../../intefaces/accommodation.interface';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrl: './map-page.component.scss',
})
export class MapPageComponent {
  map?: mapboxgl.Map;
  public apartments: AccommodationMatchingDTO[] = [];
  sidebarOpened = true;
  @ViewChild('sidebar') sidebar!: MapSidebarComponent;

  //delete me
  // navigation: Feature;

  pinClasses: PinClass[] = [
    {
      key: 'good',
      iconName: 'good-icon',
      id: 'pins-good',
      bounds: { low: 0, high: 33 },
    },
    {
      key: 'medium',
      iconName: 'mid-icon',
      id: 'pins-mid',
      bounds: { low: 33, high: 66 },
    },
    {
      key: 'bad',
      iconName: 'bad-icon',
      id: 'pins-bad',
      bounds: { low: 66, high: 100 },
    },
  ];

  constructor(public accommodationService: AccommodationsService) {
    // this.navigation = accommodationService.getNavigations();
  }

  onMapClick(event: any) {
    const bbox: [PointLike, PointLike] = [
      [event.x - 5, event.y - 5],
      [event.x + 5, event.y + 5],
    ];
    const selectedFeatures = this.map?.queryRenderedFeatures(bbox, {
      layers: this.pinClasses.map((cl) => cl.iconName),
    });
    if (selectedFeatures?.length === 1) {
    }
  }

  /* apartments:
    | { good: Apartment[]; mid: Apartment[]; bad: Apartment[] }
    | undefined; */

  loadImageFromUrl(map: mapboxgl.Map, url: string, imageId: string) {
    this.map = map;
    map.loadImage(url, (error, image) => {
      if (error) throw error;
      if (!map.hasImage(imageId)) {
        map.addImage(imageId, image as ImageBitmap);
      }
    });
  }

  onMapLoaded(map: mapboxgl.Map) {
    this.map = map;
    this.pinClasses.forEach((item) => {
      this.loadImageFromUrl(
        map,
        `assets/images/markers/color=${item.key}, expanded=false.png`,
        item.iconName
      );
    });
  
    // Get the current bounding box of the map when it's loaded
    const bounds = this.map.getBounds();
    if(bounds) {
      const bbox: [PointLike, PointLike] = [
        [bounds.getSouthWest().lng, bounds.getSouthWest().lat], // South-West
        [bounds.getNorthEast().lng, bounds.getNorthEast().lat]  // North-East
      ];
      // Fetch accommodations within this bounding box
      this.getAccommodationsInBoundingBox(bbox);
    }
  
  }
  

  private getAccommodationsInBoundingBox(bbox: [PointLike, PointLike]) {
    let swLng, swLat, neLng, neLat;
  
    if (Array.isArray(bbox[0])) {
      // If PointLike is an array
      [swLng, swLat] = bbox[0] as [number, number]; // South-West corner
      [neLng, neLat] = bbox[1] as [number, number]; // North-East corner
    } else {
      // If PointLike is an object
      const sw = bbox[0] as { x: number, y: number };
      const ne = bbox[1] as { x: number, y: number };
      swLng = sw.x;
      swLat = sw.y;
      neLng = ne.x;
      neLat = ne.y;
    }
  
    this.accommodationService.getAccommodationsInBoundingBox(swLng, swLat, neLng, neLat)
      .subscribe((accommodations: AccommodationMatchingDTO[]) => {
        this.apartments = accommodations;
        this.pinClasses.forEach(
          (cl) => cl.features = parseGeoJson(this.apartments)
        );
      });
  }
  

  
}
