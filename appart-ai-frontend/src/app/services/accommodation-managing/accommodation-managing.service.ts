import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Accommodation } from '../../intefaces/accommodation.interface';
import { Address } from '../../intefaces/adress.interface';
import { environment } from '../../environments/environment';
import { UserService } from '../user-service/user.service';
import { ImageUrl } from '../../intefaces/image.interface';
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

  public addAccommodation(accommodation: Accommodation, images: File[], token: string): Observable<any> {
    const headers = this.getAuthHeaders(token);

    let userId = this.userService.getStoredUser()?.id || '';
    accommodation.ownerId = userId;

    if (accommodation.id) {
        return this.http.put<any>(`${this.baseUrl}/${accommodation.id}`, accommodation, { headers });
    } else {
        const formData: FormData = new FormData();
        formData.append('accommodation', new Blob([JSON.stringify(accommodation)], { type: 'application/json' }));

        if (images && images.length > 0) {
            images.forEach((image) => {
                formData.append('images', image, image.name);
            });
        }
        return this.http.post<any>(this.baseUrl, formData, { headers });
    }
  }




  public getImagesAssociatedToAccommodation(accommodationId: string, token: string): Observable<ImageUrl[]> {
    const headers = this.getAuthHeaders(token);
    return this.http.get<ImageUrl[]>(`${this.baseUrl}/${accommodationId}/images`, { headers });
  }

  public updateAccommodation(accommodationId: string, accommodation: Accommodation, token: string): Observable<Accommodation> {
    const headers = this.getAuthHeaders(token);
    return this.http.put<Accommodation>(`${this.baseUrl}/${accommodationId}`, accommodation, { headers });
  }

  public deleteAccommodation(accommodationId: string, token: string): Observable<void> {
    const headers = this.getAuthHeaders(token);
    return this.http.delete<void>(`${this.baseUrl}/${accommodationId}`, { headers });
  }

  public deleteAccommodationImage(accommodationId: string, imageUrl: string, token: string): Observable<void> {
    const headers = this.getAuthHeaders(token);
    const params = { imageUrl };
    return this.http.delete<void>(`${this.baseUrl}/${accommodationId}/images`, { headers, params });
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
