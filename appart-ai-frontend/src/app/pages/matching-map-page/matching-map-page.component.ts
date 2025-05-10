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
import { MatDialog } from '@angular/material/dialog';
import { AccommodationDialogComponent } from './accommodation-dialog/accommodation-dialog.component';

@Component({
  selector: 'app-matching-map-page',
  templateUrl: './matching-map-page.component.html',
  styleUrl: './matching-map-page.component.scss',
})
export class MatchingMapPageComponent implements OnInit, OnDestroy {
  @ViewChild('sidebar') sidebar!: MapSidebarComponent;
  public map?: mapboxgl.Map;
  public apartments: AccommodationMatchingDTO[] = [];

  public sidebarOpened = true;
  private unsubscribe$ = new Subject<void>();
  private userId = '';

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

  constructor(
    private accommodationService: AccommodationsService,
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('MatchingMapPageComponent constructor called');
    console.log(this.sidebar);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onMarkerClick(event) {
    event.originalEvent.stopPropagation();

    const feature = event.features[0];
    if (feature && feature.properties) {
      const accommodationId = feature.properties.id || feature.properties.accommodation?.id;

      const accommodation = this.apartments.find((apt) => apt.accommodation.id === accommodationId);

      if (accommodation) {
        if (this.map) {
          this.map.flyTo({
            center: accommodation.accommodation.address.location,
            zoom: 15,
            essential: true,
          });
        }

        this.openAccommodationDialog(accommodation);
      }
    }
  }

  openAccommodationDialog(accommodation: AccommodationMatchingDTO): void {
    this.dialog.open(AccommodationDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: { accommodation },
    });
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

    this.map = map;

    this.pinClasses.forEach((item) => {
      this.loadImageFromUrl(
        map,
        `assets/images/markers/color=${item.key}, expanded=false.png`,
        item.iconName
      );
    });

    map.on(
      'mouseenter',
      this.pinClasses.map((pc) => pc.iconName),
      () => {
        map.getCanvas().style.cursor = 'pointer';
      }
    );

    map.on(
      'mouseleave',
      this.pinClasses.map((pc) => pc.iconName),
      () => {
        map.getCanvas().style.cursor = '';
      }
    );

    const bounds = this.map.getBounds();
    if (bounds) {
      const bbox: [PointLike, PointLike] = [
        [bounds.getSouthWest().lng, bounds.getSouthWest().lat],
        [bounds.getNorthEast().lng, bounds.getNorthEast().lat],
      ];

      this.initializeData(bbox);
    }
  }

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;

    setTimeout(() => {
      if (this.map) {
        this.map.resize();
      }
    }, 300);
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

    console.log('User is authenticated, calling accommodation');
    this.accommodationService
      .getAccommodationsInBoundingBoxWithMatching(this.userId, swLng, swLat, neLng, neLat)
      .subscribe((accommodations: AccommodationMatchingDTO[]) => {
        console.log('accommodations:', accommodations);
        this.apartments = accommodations;

        this.updatePinFeatures();
      });
  }

  private updatePinFeatures() {
    this.pinClasses.forEach((cl) => (cl.features = undefined));

    const accommodationsByScore = this.apartments.reduce(
      (acc, apartment) => {
        const score = apartment.matching.score?.total || 0;

        const pinClass = this.pinClasses.find(
          (pc) => score >= pc.bounds.low && score < pc.bounds.high
        );

        if (pinClass) {
          if (!acc[pinClass.key]) {
            acc[pinClass.key] = [];
          }
          acc[pinClass.key].push(apartment);
        }

        return acc;
      },
      {} as Record<string, AccommodationMatchingDTO[]>
    );

    this.pinClasses.forEach((pinClass) => {
      const accommodations = accommodationsByScore[pinClass.key] || [];
      pinClass.features = parseGeoJson(accommodations);
    });
  }

  private initializeData(bbox: [PointLike, PointLike]) {
    combineLatest([this.authService.isAuthenticated$, this.tokenService.getToken$()])
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
