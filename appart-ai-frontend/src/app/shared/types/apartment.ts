import { Position } from 'geojson';
import { LngLat } from 'mapbox-gl';

interface MinMax<T> {
  min?: T;
  max?: T;
}

interface ApartmentChild {
  recommendationScore: number;
  id: string;
  title: string;
  price: MinMax<number>;
  bathrooms?: number;
  squareFootage?: MinMax<number>;
  beds?: number;
}

interface coordinates {
  lat: number;
  lng: number;
}

export interface Apartment extends ApartmentChild {
  contact?: { phone: string; email: string };
  image_urls?: {
    uri: string;
    alt: string;
  }[];
  children?: ApartmentChild[];
  coords: coordinates;
}
