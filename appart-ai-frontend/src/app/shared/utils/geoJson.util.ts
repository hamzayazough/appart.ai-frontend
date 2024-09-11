import { FeatureCollection } from 'geojson';
import { Apartment } from '../../shared/types/apartment';

export function parseGeoJson(accomodations: Apartment[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: accomodations.map((accom: Apartment) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [accom.coords.lat, accom.coords.lng],
        },
        properties: {},
      };
    }),
  };
}
