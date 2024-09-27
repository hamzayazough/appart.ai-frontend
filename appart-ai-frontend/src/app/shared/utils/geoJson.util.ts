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
          coordinates: [accom.value.address.location[0], accom.value.address.location[1]],
        },
        properties: accom,
      };
    }),
  };
}
