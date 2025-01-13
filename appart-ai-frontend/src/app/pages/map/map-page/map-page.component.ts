import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PointLike } from 'mapbox-gl';
import { parseGeoJson } from '../../../shared/utils/geoJson.util';
import { AccommodationsService } from '../../../services/accomodations/accomodations.service';
import { PinClass } from './pinClass';
import { MapSidebarComponent } from '../map-sidebar/map-sidebar.component';
import { combineLatest, filter, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { TokenService } from '../../../services/token-service/token.service';
import { AccommodationMatchingDTO } from '../../../intefaces/accommodation.interface';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrl: './map-page.component.scss',
})

export class MapPageComponent implements OnInit, OnDestroy{

  @ViewChild('sidebar') sidebar!: MapSidebarComponent;
  public map?: mapboxgl.Map;
  public apartments: AccommodationMatchingDTO[] = [];

  public sidebarOpened = true;
  private unsubscribe$ = new Subject<void>();
  private bbox: [PointLike, PointLike] = [[0, 0], [0, 0]];
  private isUserAuthenticated: boolean = false;
  private userId: string = "";
  private isMapLoaded = false;


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
    this.initializeData();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onMapClick(event: any) {
    this.bbox = [
      [event.x - 5, event.y - 5],
      [event.x + 5, event.y + 5],
    ];
    const selectedFeatures = this.map?.queryRenderedFeatures(this.bbox, {
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
      this.bbox = [
        [bounds.getSouthWest().lng, bounds.getSouthWest().lat], // South-West
        [bounds.getNorthEast().lng, bounds.getNorthEast().lat]  // North-East
      ];
    }
    console.log(this.bbox);
    this.isMapLoaded = true;
  }
  

  private getAccommodationsInBoundingBox() {
    console.log('getAccommodationsInBoundingBox called:', this.bbox);
    let swLng, swLat, neLng, neLat;
  
    if (Array.isArray(this.bbox[0])) {
      // If PointLike is an array
      [swLng, swLat] = this.bbox[0] as [number, number]; // South-West corner
      [neLng, neLat] = this.bbox[1] as [number, number]; // North-East corner
    } else {
      // If PointLike is an object
      const sw = this.bbox[0] as { x: number, y: number };
      const ne = this.bbox[1] as { x: number, y: number };
      swLng = sw.x;
      swLat = sw.y;
      neLng = ne.x;
      neLat = ne.y;
    }
    console.log('SW', this.isUserAuthenticated);
    if (this.isUserAuthenticated) {
      console.log('User is authenticated, calling accommodation');
      this.accommodationService.getAccommodationsInBoundingBoxWithMatching(this.userId, swLng, swLat, neLng, neLat)
        .subscribe((accommodations: AccommodationMatchingDTO[]) => {
          console.log('accommodations:', accommodations);
          this.apartments = accommodations;
          this.pinClasses.forEach(
            (cl) => cl.features = parseGeoJson(this.apartments)
          );
        });
    } else {
      this.accommodationService.getAccommodationsInBoundingBox(swLng, swLat, neLng, neLat)
        .subscribe((accommodations: AccommodationMatchingDTO[]) => {
          this.apartments = accommodations;
          this.pinClasses.forEach(
            (cl) => cl.features = parseGeoJson(this.apartments)
          );
        });
      }
  }
  

  private initializeData() {
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
        this.isUserAuthenticated = isAuthenticated;
        const user = this.authService.getStoredUser();
  
        if (user) {
          this.userId = user.id;
        }
        while (!this.isMapLoaded) {
          console.log('Waiting for the map to load');
        }
        this.getAccommodationsInBoundingBox();
        console.log('We are calling getAccommodations:', isAuthenticated);
      });

  }
  
  
}
