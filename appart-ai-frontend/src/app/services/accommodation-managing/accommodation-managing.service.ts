import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { Accommodation } from '../../intefaces/accommodation.interface';
import { Address } from '../../intefaces/adress.interface';
import { environment } from '../../environments/environment';
import { UserService } from '../user-service/user.service';
import { ImageUrl } from '../../intefaces/image.interface';
import { TokenService } from '../token-service/token.service';
@Injectable({
  providedIn: 'root',
})
export class AccommodationManagingService {
  private apiUrl = '/protected/api/accommodations/management';
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  public getLandlordAccommodations(landlordId: string): Observable<Accommodation[]> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<Accommodation[]>(`${this.baseUrl}/landlord/${landlordId}`, { headers })
      ),
      catchError(this.handleError)
    );
  }

  public addAccommodation(accommodation: Accommodation, images: File[]): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        if (accommodation.id) {
          return this.http.put<any>(`${this.baseUrl}/${accommodation.id}`, accommodation, {
            headers,
          });
        } else {
          const formData: FormData = new FormData();
          formData.append(
            'accommodation',
            new Blob([JSON.stringify(accommodation)], { type: 'application/json' })
          );

          if (images && images.length > 0) {
            images.forEach((image) => formData.append('images', image, image.name));
          }

          return this.http.post<any>(this.baseUrl, formData, { headers });
        }
      }),
      catchError(this.handleError)
    );
  }

  public getImagesAssociatedToAccommodation(accommodationId: string): Observable<ImageUrl[]> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<ImageUrl[]>(`${this.baseUrl}/${accommodationId}/images`, { headers })
      ),
      catchError(this.handleError)
    );
  }

  public updateAccommodation(
    accommodationId: string,
    accommodation: Accommodation
  ): Observable<Accommodation> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.put<Accommodation>(`${this.baseUrl}/${accommodationId}`, accommodation, {
          headers,
        })
      ),
      catchError(this.handleError)
    );
  }

  public deleteAccommodation(accommodationId: string): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.delete<void>(`${this.baseUrl}/${accommodationId}`, { headers })
      ),
      catchError(this.handleError)
    );
  }

  public deleteAccommodationImage(accommodationId: string, imageUrl: string): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        const params = { imageUrl };
        return this.http.delete<void>(`${this.baseUrl}/${accommodationId}/images`, {
          headers,
          params,
        });
      }),
      catchError(this.handleError)
    );
  }

  public getAccommodationViewsAndInterests(accommodationId: string): Observable<Accommodation> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<Accommodation>(`${this.baseUrl}/${accommodationId}/views-interests`, {
          headers,
        })
      ),
      catchError(this.handleError)
    );
  }

  public updateAccommodationAddress(
    accommodationId: string,
    address: Address
  ): Observable<Accommodation> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.put<Accommodation>(`${this.baseUrl}/${accommodationId}/address`, address, {
          headers,
        })
      ),
      catchError(this.handleError)
    );
  }

  private getAuthHeaders(): Observable<HttpHeaders> {
    return this.tokenService.getToken$().pipe(
      switchMap((token) => {
        if (!token) {
          throw new Error('Token is not available. Please log in.');
        }
        return of(new HttpHeaders({ Authorization: `Bearer ${token}` }));
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('An error occurred; please try again later.'));
  }
}
