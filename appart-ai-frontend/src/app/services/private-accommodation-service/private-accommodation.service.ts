import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AppUser } from '../../intefaces/user.interface';
import { Accommodation } from '../../intefaces/accommodation.interface';

@Injectable({
  providedIn: 'root'
})
export class PrivateAccommodationService {

  private apiUrl = '/protected/api/accommodation'
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(private http: HttpClient) { }

  // Antoine
  public getUserSuggestedAccommodations(userId: string, page: number, quantity: number, token: string): Observable<Accommodation[]> {
    const url = `${this.baseUrl}/${userId}/suggested-accommodations`;
    const headers = this.getAuthHeaders(token);
    const params = new HttpParams()
      .set('page', page.toString())
      .set('quantity', quantity.toString());

    return this.http.get<Accommodation[]>(url, { headers, params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // faut que je me rappel d'incrémenter le nb de viewing et ajouter une relation dans bd
  public getAccommodationDetails(userId: string, accommodationId: string, token: string): Observable<Accommodation> {
    const url = `${this.baseUrl}/${userId}/accommodation/${accommodationId}`;
    const headers = this.getAuthHeaders(token);
    return this.http.get<Accommodation>(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  public createInterestRelation(userId: string, accommodationId: string, token: string): Observable<boolean> {
    const url = `${this.baseUrl}/${userId}/accommodation/${accommodationId}/interest`;
    const headers = this.getAuthHeaders(token);
    return this.http.post<boolean>(url, {}, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  public addCommentToAccommodation(userId: string, accommodationId: string, comment: Comment, token: string): Observable<Comment> {
    const url = `${this.baseUrl}/${userId}/accommodation/${accommodationId}/comments`;
    const headers = this.getAuthHeaders(token);
    return this.http.post<Comment>(url, comment, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  public showAccommodationInterestedUsers(accommodationId: string, token: string): Observable<AppUser[]> {
    const url = `${this.baseUrl}/accommodation/${accommodationId}/interested-users`;
    const headers = this.getAuthHeaders(token);
    return this.http.get<AppUser[]>(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private handleError(error: any): Observable<never> {
    // Tu peux personnaliser le traitement des erreurs ici
    console.error('Une erreur est survenue:', error);
    return throwError(() => new Error('Une erreur est survenue; veuillez réessayer plus tard.'));
  }

}
