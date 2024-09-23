import { Injectable } from '@angular/core';
import { Feature } from 'geojson';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Accommodation, AccommodationMatchingDTO } from '../../intefaces/accommodation.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccommodationsService {
  private url = '/public/api/accommodations';
  private apiUrl: string = environment.apiUrl + this.url;

  constructor(private http: HttpClient) { }


  getAccommodations(): Observable<Accommodation[]> {
    return this.http.get<Accommodation[]>(`${this.apiUrl}`);
  }

  getAccommodationsInBoundingBox(minLat: number, minLong: number, maxLat: number, maxLong: number): Observable<AccommodationMatchingDTO[]> {
    return this.http.get<AccommodationMatchingDTO[]>(
      `${this.apiUrl}/in-bounding-box?minLat=${minLat}&minLong=${minLong}&maxLat=${maxLat}&maxLong=${maxLong}`
    );
  }

  // TODO: à supprimer par Antoine
  getNavigations(): Feature {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [-73.563479, 45.533552],
          [-73.562466, 45.533037],
          [-73.562612, 45.532593],
          [-73.562604, 45.532577],
          [-73.562489, 45.532518],
          [-73.563935, 45.52795],
          [-73.556836, 45.524635],
          [-73.55681, 45.524673],
          [-73.556335, 45.524479],
          [-73.556306, 45.524485],
          [-73.556206, 45.524507],
          [-73.556196, 45.524513],
          [-73.556047, 45.5247],
          [-73.556015, 45.524688],
          [-73.555692, 45.525016],
          [-73.555264, 45.525494],
          [-73.55454, 45.525601],
          [-73.546679, 45.522577],
          [-73.535035, 45.520528],
          [-73.519519, 45.521962],
          [-73.517534, 45.522579],
          [-73.516439, 45.524416],
          [-73.518292, 45.525186],
          [-73.515634, 45.525154],
          [-73.515357, 45.525266],
          [-73.513302, 45.525464],
          [-73.51018, 45.524458],
          [-73.50872, 45.523979],
          [-73.503811, 45.522563],
          [-73.503637, 45.522645],
          [-73.502405, 45.522244],
          [-73.502235, 45.52251],
          [-73.501219, 45.522181],
          [-73.501184, 45.522252],
          [-73.501099, 45.522224],
          [-73.500367, 45.52342],
          [-73.49744, 45.522428],
          [-73.49723, 45.52303],
          [-73.497319, 45.523062],
          [-73.493325, 45.525089],
          [-73.493236, 45.525059],
          [-73.485288, 45.530903],
          [-73.483894, 45.530319],
          [-73.482671, 45.533308],
          [-73.469533, 45.529964],
          [-73.468789, 45.531316],
          [-73.46791, 45.531426],
          [-73.466978, 45.531707],
          [-73.466664, 45.531441],
          [-73.462954, 45.53047],
          [-73.462589, 45.531614],
        ],
        type: 'LineString',
      },
    };
  }

  
}
