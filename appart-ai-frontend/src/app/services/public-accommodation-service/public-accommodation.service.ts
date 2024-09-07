import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Accommodation } from '../../intefaces/accommodation.interface';

@Injectable({
  providedIn: 'root'
})
export class PublicAccommodationService {

  private apiUrl = '/public/api/accommodation'
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(private http: HttpClient) { }

  public getAccommodationsByFilters(filters: any): Observable<Accommodation[]> {
    const url = `${this.baseUrl}/filters`;
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key] != null) {
        params = params.set(key, filters[key]);
      }
    });

    return this.http.get<Accommodation[]>(url, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getAllAccommodations(page: number, volume: number, location?: string): Observable<Accommodation[]> {
    const url = `${this.baseUrl}/all`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('volume', volume.toString());

    if (location) {
      params = params.set('location', location);
    }

    return this.http.get<Accommodation[]>(url, { params })
      .pipe(
        catchError(this.handleError)
      );
  }
  // à voir si je fais vrm une methode public pcq comment on va gérer les consultations si on ne connait pas les utilisateurs qui ont consulté un appart?
  public getAccommodationDetails(accommodationId: string): Observable<Accommodation> {
    const url = `${this.baseUrl}/${accommodationId}`;
    return this.http.get<Accommodation>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Une erreur est survenue:', error);
    return throwError(() => new Error('Une erreur est survenue; veuillez réessayer plus tard.'));
  }


}
