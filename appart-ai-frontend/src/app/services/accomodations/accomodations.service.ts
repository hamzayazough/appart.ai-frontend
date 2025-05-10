import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  Accommodation,
  AccommodationMatchingDetailsDTO,
} from '../../intefaces/accommodation.interface';
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

  constructor(
    private http: HttpClient,
    private userRelatedAccommodations: UserRelatedAccommodationsService
  ) {}

  public getAccommodationsInBoundingBoxWithMatching(
    userId: string,
    minLat: number,
    minLong: number,
    maxLat: number,
    maxLong: number
  ): Observable<AccommodationMatchingDTO[]> {
    return this.userRelatedAccommodations.getAccommodationsInBoundingBoxWithMatching(
      userId,
      minLat,
      minLong,
      maxLat,
      maxLong
    );
  }

  public getRecentMatchingAccommodations(
    userId: string,
    page = 0,
    size = 20
  ): Observable<AccommodationMatchingDTO[]> {
    return this.userRelatedAccommodations.getRecentMatchingAccommodations(userId, page, size);
  }

  public getAccommodationById(
    id: string,
    userId: string
  ): Observable<AccommodationMatchingDetailsDTO> {
    return this.http.get<AccommodationMatchingDetailsDTO>(`${this.apiUrl}/${userId}/${id}`);
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
