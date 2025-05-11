import { Place } from './place.interface';

export interface UserPreferences {
  occupation: string;
  pets: boolean;
  places: Place[];
  minBudget: number;
  maxBudget: number;
  car: boolean;
  publicTransportationProximity: number;
  parking: number;
  groceryStoreProximity: number;
  numBedroomMin: number;
  numBathroomMin: number;
  minAvailableDate: Date;
  maxAvailableDate: Date;
  airConditioning: boolean;
  furnished: boolean;
  utilitiesIncluded: boolean;
  dishwasher: boolean;
  stainlessSteelAppliances: boolean;
  patio: boolean;
  balcony: boolean;
  refrigerator: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  gymIncluded: boolean;

  // nw:
  pool: boolean;
  elevator: boolean;
  garage: boolean;
  minimalConstructionDate: number; // year
  minimalLandArea: number;
}
