import { Component, OnDestroy, ViewChild } from '@angular/core';
import { PointLike } from 'mapbox-gl';
import { parseGeoJson } from '../../../shared/utils/geoJson.util';
import { AccommodationsService } from '../../../services/accomodations/accomodations.service';
import { PinClass } from './pinClass';
import { MapSidebarComponent } from '../map-sidebar/map-sidebar.component';
import { Subject } from 'rxjs';
import { AccommodationMatchingDTO } from '../../../intefaces/accommodation.interface';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrl: './map-page.component.scss',
})
export class MapPageComponent implements OnDestroy {
  @ViewChild('sidebar') sidebar!: MapSidebarComponent;
  public map?: mapboxgl.Map;
  public apartments: AccommodationMatchingDTO[] = [];

  public sidebarOpened = true;
  private unsubscribe$ = new Subject<void>();

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

  constructor(private accommodationService: AccommodationsService) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onMapClick(event) {
    const bbox: [PointLike, PointLike] = [
      [event.x - 5, event.y - 5],
      [event.x + 5, event.y + 5],
    ];
    const selectedFeatures = this.map?.queryRenderedFeatures(bbox, {
      layers: this.pinClasses.map((cl) => cl.iconName),
    });
    if (selectedFeatures?.length === 1) {
      // TODO: Handle the case when only one feature is selected
    }
  }

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

    const bounds = this.map.getBounds();
    if (bounds) {
      const bbox: [PointLike, PointLike] = [
        [bounds.getSouthWest().lng, bounds.getSouthWest().lat],
        [bounds.getNorthEast().lng, bounds.getNorthEast().lat],
      ];
      this.getAccommodationsInBoundingBox(bbox);
    }
  }

  private getAccommodationsInBoundingBox(bbox: [PointLike, PointLike]) {
    console.log('getAccommodationsInBoundingBox called:', bbox);
    let swLng, swLat, neLng, neLat;

    if (Array.isArray(bbox[0])) {
      [swLng, swLat] = bbox[0] as [number, number];
      [neLng, neLat] = bbox[1] as [number, number];
    } else {
      const sw = bbox[0] as { x: number; y: number };
      const ne = bbox[1] as { x: number; y: number };
      swLng = sw.x;
      swLat = sw.y;
      neLng = ne.x;
      neLat = ne.y;
    }

    console.log('User is not authenticated, calling accommodation');
    this.accommodationService
      .getAccommodationsInBoundingBox(swLng, swLat, neLng, neLat)
      .subscribe((accommodations: AccommodationMatchingDTO[]) => {
        console.log('accommodations:', accommodations);
        this.apartments = accommodations;
        this.pinClasses.forEach((cl) => (cl.features = parseGeoJson(this.apartments)));
      });
  }
}
