import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Accommodation } from '../../intefaces/accommodation.interface';
import { Observable } from 'rxjs';
import { AppUser } from '../../intefaces/user.interface';
import { UserRelatedAccommodationsService } from '../private-accommodation-service/user-related-accommodations.service';
import { AccommodationMatchingDTO } from '../../intefaces/accommodation.interface';

@Injectable({
  providedIn: 'root',
})
export class AccommodationsService {
  private url = '/public/api/accommodations';
  private apiUrl: string = environment.apiUrl + this.url;

  constructor(private http: HttpClient, private userRelatedAccommodations: UserRelatedAccommodationsService) { }


  public getAccommodationsInBoundingBox(minLat: number, minLong: number, maxLat: number, maxLong: number): Observable<AccommodationMatchingDTO[]> {
    return this.http.get<AccommodationMatchingDTO[]>(
      `${this.apiUrl}/in-bounding-box?minLat=${minLat}&minLong=${minLong}&maxLat=${maxLat}&maxLong=${maxLong}`
    );
  }

  public getAccommodationsInBoundingBoxWithMatching(userId: string, minLat: number, minLong: number, maxLat: number, maxLong: number): Observable<AccommodationMatchingDTO[]> {
    return this.userRelatedAccommodations.getAccommodationsInBoundingBoxWithMatching(userId, minLat, minLong, maxLat, maxLong);
  }

  public getAccommodationById(id: string): Observable<Accommodation> {
    return this.http.get<Accommodation>(`${this.apiUrl}/${id}`);
  }



  public getInterestedPeople(accommodationId: string): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.apiUrl}/${accommodationId}/interested-people`);
  }

  public getUserInterest(accommodationId: string, userId: string): Observable<string> {
    return this.userRelatedAccommodations.getUserInterest(accommodationId, userId);
  }

  public expressMyInterest(accommodationId: string, userId: string): Observable<number> {
    return this.userRelatedAccommodations.expressMyInterest(accommodationId, userId);
  }

  public addToFavorites(accommodationId: string, userId: string): Observable<number> {
    return this.userRelatedAccommodations.addToFavorites(accommodationId, userId);
  }

  public incrementViews(accommodationId: string, userId: string): Observable<number> {
    return this.userRelatedAccommodations.incrementViews(accommodationId, userId);
  }


}
