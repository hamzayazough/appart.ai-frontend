import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Accommodation } from '../../intefaces/accommodation.interface';
import { Address } from '../../intefaces/adress.interface';
import { environment } from '../../environments/environment';
import { UserService } from '../user-service/user.service';


@Injectable({
  providedIn: 'root'
})
export class AccommodationManagingService {

  private apiUrl = '/protected/api/accommodations/management';
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) { }


  public getLandlordAccommodations(landlordId: string, token: string): Observable<Accommodation[]> {
    const headers = this.getAuthHeaders(token);
    return this.http.get<Accommodation[]>(`${this.baseUrl}/landlord/${landlordId}`, { headers });
  }

  public addAccommodation(accommodation: Accommodation, images: File[], token: string): Observable<Accommodation> {
    let userId = this.userService.getStoredUser()?.id || '';
    
    const headers = this.getAuthHeaders(token);

    accommodation.ownerId = userId;

    const formData: FormData = new FormData();

    formData.append('accommodation', new Blob([JSON.stringify(accommodation)], { type: 'application/json' }));

    images.forEach((image, index) => {
        formData.append('images', image, image.name);
    });

    return this.http.post<Accommodation>(this.baseUrl, formData, { headers });
}


  public updateAccommodation(accommodationId: string, accommodation: Accommodation, token: string): Observable<Accommodation> {
    const headers = this.getAuthHeaders(token);
    return this.http.put<Accommodation>(`${this.baseUrl}/${accommodationId}`, accommodation, { headers });
  }

  public deleteAccommodation(accommodationId: string, token: string): Observable<void> {
    const headers = this.getAuthHeaders(token);
    return this.http.delete<void>(`${this.baseUrl}/${accommodationId}`, { headers });
  }

  public getAccommodationViewsAndInterests(accommodationId: string, token: string): Observable<Accommodation> {
    const headers = this.getAuthHeaders(token);
    return this.http.get<Accommodation>(`${this.baseUrl}/${accommodationId}/views-interests`, { headers });
  }

  public updateAccommodationAddress(accommodationId: string, address: Address, token: string): Observable<Accommodation> {
    const headers = this.getAuthHeaders(token);
    return this.http.put<Accommodation>(`${this.baseUrl}/${accommodationId}/address`, address, { headers });
  }

    private getAuthHeaders(token: string): HttpHeaders {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
}
