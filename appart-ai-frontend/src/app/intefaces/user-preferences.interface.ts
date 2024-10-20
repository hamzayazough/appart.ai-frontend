import { Address } from "./adress.interface";

export interface UserPreferences {
  occupation: string;
  pets: boolean;
  schoolAddress: Address;
  workAddress: Address;
  workAddressWeight: number;
  schoolAddressWeight: number;
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
}
