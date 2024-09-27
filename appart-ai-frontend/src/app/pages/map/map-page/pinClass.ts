import { FeatureCollection } from 'geojson';

type Rating = 'good' | 'medium' | 'bad';

export interface PinClass {
  key: Rating;
  iconName: string;
  id: string;
  features?: FeatureCollection;
  bounds: {
    low: number;
    high: number;
  };
}
