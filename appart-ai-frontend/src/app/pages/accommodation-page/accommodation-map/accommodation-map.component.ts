import { Component, OnInit, Input } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { Accommodation } from '../../../intefaces/accommodation.interface';

@Component({
  selector: 'app-accommodation-map',
  templateUrl: './accommodation-map.component.html',
  styleUrls: ['./accommodation-map.component.scss']
})
export class AccommodationMapComponent implements OnInit {

  @Input() accommodation!: Accommodation;
  map: Map = {} as Map;

  ngOnInit() {
    if (this.accommodation) {
    }
  }

  onMapLoaded(map: mapboxgl.Map) {
    this.map = map;

    this.loadImageFromUrl(map, 'assets/images/markers/color100.png', 'color100-marker');

    this.addMarkerToLocation(this.accommodation.address.location);
  }

  loadImageFromUrl(map: mapboxgl.Map, url: string, imageId: string) {
    map.loadImage(url, (error, image) => {
      if (error) throw error;
      if (!map.hasImage(imageId)) {
        map.addImage(imageId, image as ImageBitmap);
      }
    });
  }

  addMarkerToLocation(location: [number, number]) {
    new Marker({ color: 'red', scale: 1.5 })
      .setLngLat(location)
      .addTo(this.map);
  }
}
