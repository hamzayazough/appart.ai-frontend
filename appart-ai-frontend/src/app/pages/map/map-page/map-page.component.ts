import { Component } from '@angular/core';
import { Feature, FeatureCollection, Point } from 'geojson';
import { Apartment } from '../../../shared/types/apartment';
import { PointLike } from 'mapbox-gl';
import { parseGeoJson } from '../../../shared/utils/geoJson.util';
import { AccommodationsService } from '../../../services/accomodations/accomodations.service';

import { PinClass } from './pinClass';
import { Recommendation } from '../../../shared/types/recommendation';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrl: './map-page.component.scss',
})
export class MapPageComponent {
  map?: mapboxgl.Map;
  apartments: Recommendation<Apartment>[];
  sidebarOpened = true;

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

  constructor(public accomodationService: AccommodationsService) {
    this.apartments = this.accomodationService.getAccomodations();
    this.pinClasses.forEach(
      (cl) =>
        (cl.features = parseGeoJson(
          this.apartments
            .filter(
              (a: Recommendation<Apartment>) =>
                cl.bounds.low < a.score && a.score <= cl.bounds.high
            )
            .map((x) => x.value)
        ))
    );
  }

  onMapClick(event: any) {
    console.log(event);
    const bbox: [PointLike, PointLike] = [
      [event.x - 5, event.y - 5],
      [event.x + 5, event.y + 5],
    ];
    const selectedFeatures = this.map?.queryRenderedFeatures(bbox, {
      layers: this.pinClasses.map((cl) => cl.iconName),
    });
    console.log('features', selectedFeatures);
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
    this.pinClasses.forEach((item) => {
      this.loadImageFromUrl(
        map,
        `assets/images/markers/color=${item.key}, expanded=false.png`,
        item.iconName
      );
    });
  }
}
