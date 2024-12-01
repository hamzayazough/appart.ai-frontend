import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

@Component({
  selector: 'app-preference-map',
  templateUrl: './preference-map.component.html',
  styleUrl: './preference-map.component.scss'
})
export class PreferenceMapComponent implements OnInit {
  map!: mapboxgl.Map; // Instance de la carte Mapbox
  draw: MapboxDraw; // Instance de Mapbox Draw

  constructor() {
    // Initialisation de Mapbox Draw avec les contrôles souhaités
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: 'draw_polygon',
    });
  }

  ngOnInit(): void {
    // Logic supplémentaire à ajouter si nécessaire lors de l'initialisation
  }

  /**
   * Callback exécuté lorsque la carte est chargée.
   * @param map Instance de la carte MapboxGL
   */
  onMapLoaded(map: mapboxgl.Map): void {
    this.map = map;

    // Ajouter des contrôles de navigation à la carte
    const navigationControl = new mapboxgl.NavigationControl();
    this.map.addControl(navigationControl, 'top-right');

    // Ajouter le contrôle de dessin à la carte
    this.map.addControl(this.draw, 'top-right');
  }

  /**
   * Callback exécuté lorsque l'utilisateur crée une nouvelle forme.
   * @param event Événement émis par Mapbox Draw
   */
  onDrawCreate(event: any): void {
    const data = this.draw.getAll();
    if (data.features.length > 0) {
      const coordinates = data.features[0].geometry;
      console.log('Polygon created with coordinates:', coordinates);
    }
  }

  /**
   * Callback exécuté lorsque l'utilisateur met à jour une forme existante.
   * @param event Événement émis par Mapbox Draw
   */
  onDrawUpdate(event: any): void {
    const data = this.draw.getAll();
    if (data.features.length > 0) {
      const coordinates = data.features[0].geometry;
      console.log('Polygon updated with coordinates:', coordinates);
    }
  }

  /**
   * Callback exécuté lorsque l'utilisateur supprime une forme.
   * @param event Événement émis par Mapbox Draw
   */
  onDrawDelete(event: any): void {
    console.log('Polygon deleted');
  }
}

