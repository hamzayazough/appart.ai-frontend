import type { FeatureCollection } from "geojson"
import type { AccommodationMatchingDTO } from "../../intefaces/accommodation.interface"

export function parseGeoJson(accomodations: AccommodationMatchingDTO[]): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: accomodations.map((accom: AccommodationMatchingDTO) => {
      // Determine category based on score
      const score = accom.matching.score?.total || 0
      let category = "bad"

      if (score <= 33) {
        category = "good"
      } else if (score <= 66) {
        category = "medium"
      }

      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [accom.accommodation.address.location[0], accom.accommodation.address.location[1]],
        },
        properties: {
          id: accom.accommodation.id, // Ensure ID is directly accessible
          category, // Add category for marker color
          accommodation: accom.accommodation, // Include the full accommodation object
          matching: accom.matching, // Include the matching data
        },
      }
    }),
  }
}
