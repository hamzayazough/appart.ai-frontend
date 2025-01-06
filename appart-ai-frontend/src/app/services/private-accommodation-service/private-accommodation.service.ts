import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AppUser } from '../../intefaces/user.interface';
import { Accommodation, AccommodationBaseDTO } from '../../intefaces/accommodation.interface';
import { TokenService } from '../token-service/token.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateAccommodationService {

  private apiUrl: string = '/protected/api/accommodation'
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  // Antoine
  public getUserSuggestedAccommodations(userId: string, page: number, quantity: number): Observable<Accommodation[]> {
    const url = `${this.baseUrl}/${userId}/suggested-accommodations`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('quantity', quantity.toString());

    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<Accommodation[]>(url, { headers, params }).pipe(
          catchError(this.handleError)
        )
      )
    );
  }

  public getAccommodationDetails(userId: string, accommodationId: string): Observable<Accommodation> {
    const url = `${this.baseUrl}/${userId}/accommodation/${accommodationId}`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<Accommodation>(url, { headers }).pipe(
          catchError(this.handleError)
        )
      )
    );
  }

  public createInterestRelation(userId: string, accommodationId: string): Observable<boolean> {
    const url = `${this.baseUrl}/${userId}/accommodation/${accommodationId}/interest`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<boolean>(url, {}, { headers }).pipe(
          catchError(this.handleError)
        )
      )
    );
  }

  public addCommentToAccommodation(userId: string, accommodationId: string, comment: Comment): Observable<Comment> {
    const url = `${this.baseUrl}/${userId}/accommodation/${accommodationId}/comments`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<Comment>(url, comment, { headers }).pipe(
          catchError(this.handleError)
        )
      )
    );
  }

  public showAccommodationInterestedUsers(accommodationId: string): Observable<AppUser[]> {
    const url = `${this.baseUrl}/accommodations/${accommodationId}/interested-users`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<AppUser[]>(url, { headers }).pipe(
          catchError(this.handleError)
        )
      )
    );
  }

  public getSavedAccommodations(userId: string): Observable<AccommodationBaseDTO[]> {
    const url = `${this.baseUrl}/saved-accommodations/${userId}`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<AccommodationBaseDTO[]>(url, { headers }).pipe(
          catchError(this.handleError)
        )
      )
    );
  }

  public removeSavedAccommodation(userId: string, accommodationId: string): Observable<void> {
    const url = `${this.baseUrl}/saved-accommodations/${userId}/saved/${accommodationId}`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.delete<void>(url, { headers }).pipe(
          catchError(this.handleError)
        )
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
  

  private handleError(error: any): Observable<never> {
    console.error('Une erreur est survenue:', error);
    return throwError(() => new Error('Une erreur est survenue; veuillez réessayer plus tard.'));
  }


}
