import { Injectable } from '@angular/core';
import { Apartment } from '../../shared/types/apartment';

@Injectable({
  providedIn: 'root',
})
export class AccommodationsService {
  constructor() {}

  getAccomodations(): Apartment[] {
    return [
      {
        recommendationScore: 50,
        title: 'test',
        id: 'test',
        price: { min: 50 },
        coords: { lat: -73.56253, lng: 45.5316 },
      },
    ];
  }
}
