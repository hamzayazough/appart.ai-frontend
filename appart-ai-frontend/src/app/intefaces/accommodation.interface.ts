import { Coordinate } from "mapbox-gl";
import { Address } from "./adress.interface";
import { Image, ImageUrl } from "./image.interface";
import exp from "constants";
import { UserAccommodationMatching } from "./matching.interface";

export interface Accommodation {
    id: string;
    title: string;
    description: string;
    rentPrice: number;
    numBeds: number;
    numBathrooms: number;
    squareFootage: number;
    phone: string;
    offerDate?: Date;
    numViews: number;
    numInterestedPrivate: number;
    numInterestedPublic: number;
    address: Address;
    ownerId: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;

    floorNumber?: number;
    availabilityStatus: string;
    availableFrom: string;
    leaseDuration?: number;  
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
    gym: boolean;
    parkingIncluded: boolean;
    roommateAccepted: boolean;
    imageUrls: ImageUrl[];
  }

  export interface AccommodationMatchingDTO {
    matching: UserAccommodationMatching;
    accommodation: AccommodationBaseDTO;
}

  export interface AccommodationBaseDTO {
    id: string;
    title: string;
    bedrooms: number;
    bathrooms: number;
    price: number;
    address: Address;
    imageUrls: ImageUrl[];
  }
