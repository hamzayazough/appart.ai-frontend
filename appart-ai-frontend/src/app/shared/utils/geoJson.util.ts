import { FeatureCollection } from 'geojson';
import { AccommodationMatchingDTO } from '../../intefaces/accommodation.interface';

export function parseGeoJson(accomodations: AccommodationMatchingDTO[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: accomodations.map((accom: AccommodationMatchingDTO) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [accom.accommodation.address.location[0], accom.accommodation.address.location[1]],
        },
        properties: accom,
      };
    }),
  };
}
