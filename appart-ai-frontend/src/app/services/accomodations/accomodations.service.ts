import { Injectable } from '@angular/core';
import { Apartment } from '../../shared/types/apartment';
import { Recommendation } from '../../shared/types/recommendation';
//for testing purposes
@Injectable({
  providedIn: 'root',
})
export class AccommodationsService {
  constructor() {}

  getAccomodations(): Recommendation<Apartment>[] {
    return [
      {
        pros: ['close to work'],
        cons: ['far from school'],
        score: 50,
        value: {
          address: '2222 hjdi',
          title: 'test',
          id: 'test',
          price: { min: 50 },
          coords: { lat: -73.46253, lng: 45.5316 },
          image_urls: [
            {
              src: 'assets/images/appart1.png',
              alt: 'appart1',
            },
            {
              src: 'assets/images/appart2.png',
              alt: 'appart1',
            },
            {
              src: 'assets/images/appart3.png',
              alt: 'appart1',
            },
          ],
        },
      },
      {
        pros: ['close to work'],
        cons: ['far from school'],
        score: 10,
        value: {
          address: '2222 hjdi',
          title: 'test',
          id: 'test',
          price: { min: 10 },
          coords: { lat: -73.57253, lng: 45.3316 },
          image_urls: [
            {
              src: 'assets/images/appart1.png',
              alt: 'appart1',
            },
            {
              src: 'assets/images/appart2.png',
              alt: 'appart1',
            },
            {
              src: 'assets/images/appart3.png',
              alt: 'appart1',
            },
          ],
        },
      },
      {
        pros: ['close to work'],
        cons: ['far from school'],
        score: 80,
        value: {
          address: '2222 hjdi',
          title: 'test',
          id: 'test',
          price: { min: 50 },
          coords: { lat: -73.56353, lng: 45.5335 },
          image_urls: [
            {
              src: 'assets/images/appart1.png',
              alt: 'appart1',
            },
            {
              src: 'assets/images/appart2.png',
              alt: 'appart1',
            },
            {
              src: 'assets/images/appart3.png',
              alt: 'appart1',
            },
          ],
        },
      },
    ];
  }
}
