import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PointLike } from 'mapbox-gl';
import { parseGeoJson } from '../../shared/utils/geoJson.util';
import { AccommodationsService } from '../../services/accomodations/accomodations.service';
import { PinClass } from '../map/map-page/pinClass';
import { MapSidebarComponent } from '../map/map-sidebar/map-sidebar.component';
import { combineLatest, filter, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { TokenService } from '../../services/token-service/token.service';
import { AccommodationMatchingDTO } from '../../intefaces/accommodation.interface';

@Component({
  selector: 'app-matching-map-page',
  templateUrl: './matching-map-page.component.html',
  styleUrl: './matching-map-page.component.scss'
})
export class MatchingMapPageComponent implements OnInit, OnDestroy{

  @ViewChild('sidebar') sidebar!: MapSidebarComponent;
  public map?: mapboxgl.Map;
  public apartments: AccommodationMatchingDTO[] = [];

  public sidebarOpened = true;
  private unsubscribe$ = new Subject<void>();
  private userId: string = "";


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

  constructor(private accommodationService: AccommodationsService, private authService: AuthenticationService, private tokenService: TokenService) {
  }

  ngOnInit(): void {
    console.log('MatchingMapPageComponent constructor called');
    console.log(this.sidebar);
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

      this.initializeData(bbox);
    }
  }
  

  private getAccommodationsInBoundingBox(bbox: [PointLike, PointLike]) {
    console.log('getAccommodationsInBoundingBox called:', bbox);
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
      console.log('User is authenticated, calling accommodation');
      this.accommodationService.getAccommodationsInBoundingBoxWithMatching(this.userId, swLng, swLat, neLng, neLat)
        .subscribe((accommodations: AccommodationMatchingDTO[]) => {
          console.log('accommodations:', accommodations);
          this.apartments = accommodations;
          this.pinClasses.forEach(
            (cl) => cl.features = parseGeoJson(this.apartments)
          );
        });
  }
  

  private initializeData(bbox: [PointLike, PointLike]) {
    // no choice of waiting for both of them cause for a mysterious reason the token is not being stored synchronously
    combineLatest([
      this.authService.isAuthenticated$,
      this.tokenService.getToken$(), 
    ])
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(([isAuthenticated, token]) => isAuthenticated && !!token)
      )
      .subscribe(([isAuthenticated]) => {  
        const user = this.authService.getStoredUser();
  
        if (user) {
          this.userId = user.id;
        }
        this.getAccommodationsInBoundingBox(bbox);
        console.log('We are calling getAccommodations:', isAuthenticated);
      });
  }
  
}
