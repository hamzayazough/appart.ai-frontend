import { Component, OnInit, Input } from '@angular/core';
import { Map, Marker, NavigationControl } from 'mapbox-gl';
import { Accommodation } from '../../../intefaces/accommodation.interface';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

@Component({
  selector: 'app-accommodation-map',
  templateUrl: './accommodation-map.component.html',
  styleUrls: ['./accommodation-map.component.scss']
})
export class AccommodationMapComponent implements OnInit {
  @Input() accommodation?: Accommodation; 
  map: Map = {} as Map;
  draw: MapboxDraw = {} as MapboxDraw;

  ngOnInit(): void {
    if (!this.accommodation) {
      this.initializeDrawTools();
    }
  }

  onMapLoaded(map: Map): void {
    console.log('Map loaded:', map);
    this.map = map;

    if (this.accommodation) {
      this.loadImageFromUrl(map, 'assets/images/markers/color100.png', 'color100-marker');
      this.addMarkerToLocation(this.accommodation.address.location);
    } else {
      this.addDrawTools();
    }

    const navigationControl = new NavigationControl();
    this.map.addControl(navigationControl, 'top-right');
  }


  addDrawTools(): void {
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: 'draw_polygon',
    });
    this.map.addControl(this.draw, 'top-left');

    console.log('Draw controls added');

    this.map.on('draw.create', this.onDrawCreate.bind(this));
    this.map.on('draw.update', this.onDrawUpdate.bind(this));
    this.map.on('draw.delete', this.onDrawDelete.bind(this));
  }

  loadImageFromUrl(map: Map, url: string, imageId: string): void {
    map.loadImage(url, (error, image) => {
      if (error) throw error;
      if (!map.hasImage(imageId)) {
        map.addImage(imageId, image as ImageBitmap);
      }
    });
  }

  addMarkerToLocation(location: [number, number]): void {
    new Marker({ color: 'red', scale: 1.5 }).setLngLat(location).addTo(this.map);
  }

  onDrawCreate(event: any): void {
    const data = this.draw.getAll();
    if (data.features.length > 0) {
      const coordinates = data.features[0].geometry;
      console.log('Polygon created with coordinates:', coordinates);
    }
  }

  onDrawUpdate(event: any): void {
    const data = this.draw.getAll();
    if (data.features.length > 0) {
      const coordinates = data.features[0].geometry;
      console.log('Polygon updated with coordinates:', coordinates);
    }
  }

  onDrawDelete(event: any): void {
    console.log('Polygon deleted');
  }

  private initializeDrawTools(): void {
    console.log('No accommodation provided, initializing draw tools...');
  }
}