import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { Accommodation, AccommodationBaseDTO } from '../../intefaces/accommodation.interface';
import { AccommodationMatchingDTO } from '../../intefaces/accommodation.interface';
import { TokenService } from '../token-service/token.service';

@Injectable({
  providedIn: 'root',
})
export class UserRelatedAccommodationsService {
  private apiUrl = '/protected/api/accommodation';
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  // TODO: à implementer plus tard comme feature
  public getUserSuggestedAccommodations(
    userId: string,
    page: number,
    quantity: number
  ): Observable<Accommodation[]> {
    const url = `${this.baseUrl}/${userId}/suggested-accommodations`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('quantity', quantity.toString());

    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<Accommodation[]>(url, { headers, params }).pipe(catchError(this.handleError))
      )
    );
  }

  public getAccommodationsInBoundingBoxWithMatching(
    userId: string,
    minLat: number,
    minLong: number,
    maxLat: number,
    maxLong: number
  ): Observable<AccommodationMatchingDTO[]> {
    const url = `${this.baseUrl}/in-bounding-box/matching/${userId}?minLat=${encodeURIComponent(minLat)}&minLong=${encodeURIComponent(minLong)}&maxLat=${encodeURIComponent(maxLat)}&maxLong=${encodeURIComponent(maxLong)}`;

    console.log('Constructed URL:', url);

    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        console.log('Received headers:', headers);
        return this.http.get<AccommodationMatchingDTO[]>(url, { headers });
      }),
      map((response) => {
        console.log('Received response:', response);
        return response || [];
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return this.handleError(error);
      })
    );
  }

  public getSavedAccommodations(userId: string): Observable<AccommodationBaseDTO[]> {
    const url = `${this.baseUrl}/saved-accommodations/${userId}`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<AccommodationBaseDTO[]>(url, { headers }).pipe(catchError(this.handleError))
      )
    );
  }

  public removeSavedAccommodation(userId: string, accommodationId: string): Observable<void> {
    const url = `${this.baseUrl}/saved-accommodations/${userId}/saved/${accommodationId}`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.delete<void>(url, { headers }).pipe(catchError(this.handleError))
      )
    );
  }

  public getUserInterest(accommodationId: string, userId: string): Observable<string> {
    const url = `${this.baseUrl}/${accommodationId}/${userId}/user-interest`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http
          .get<string>(url, { headers, responseType: 'text' as 'json' })
          .pipe(catchError(this.handleError))
      )
    );
  }

  public expressMyInterest(accommodationId: string, userId: string): Observable<number> {
    const url = `${this.baseUrl}/${accommodationId}/${userId}/express-interest`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<number>(url, {}, { headers }).pipe(catchError(this.handleError))
      )
    );
  }

  public addToFavorites(accommodationId: string, userId: string): Observable<number> {
    const url = `${this.baseUrl}/${accommodationId}/${userId}/add-to-favorites`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<number>(url, {}, { headers }).pipe(catchError(this.handleError))
      )
    );
  }

  public incrementViews(accommodationId: string, userId: string): Observable<number> {
    const url = `${this.baseUrl}/${accommodationId}/${userId}/increment-views`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<number>(url, {}, { headers }).pipe(catchError(this.handleError))
      )
    );
  }

  private getAuthHeaders(): Observable<HttpHeaders> {
    return this.tokenService.getToken$().pipe(
      switchMap((token) => {
        if (!token) {
          throw new Error('Token is not available. Please log in.');
        }
        return of(new HttpHeaders().set('Authorization', `Bearer ${token}`));
      })
    );
  }

  private handleError(error): Observable<never> {
    console.error('Une erreur est survenue:', error);
    return throwError(() => new Error('Une erreur est survenue; veuillez réessayer plus tard.'));
  }
}
