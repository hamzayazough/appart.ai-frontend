import { Position } from 'geojson';
import { LngLat } from 'mapbox-gl';
import { Image } from '../types/Image';
interface MinMax<T> {
  min?: T;
  max?: T;
}

interface ApartmentChild {
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
  address: string;
  image_urls?: Image[];
  children?: ApartmentChild[];
  coords: coordinates;
}
