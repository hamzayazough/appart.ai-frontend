import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact, ContactRequest, ContactRequestCreation } from '../../intefaces/contact.interface';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserInfo } from '../../intefaces/user.interface';
import { TokenService } from '../token-service/token.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = '/protected/api/user';
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public getUserContacts(userId: string): Observable<Contact[]> {
    const url = `${this.baseUrl}/${userId}/contact`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.get<Contact[]>(url, { headers })),
      catchError(this.handleError)
    );
  }

  public removeContact(userId: string, contactId: string): Observable<boolean> {
    const url = `${this.baseUrl}/${userId}/contact/${contactId}`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.delete<boolean>(url, { headers })),
      catchError(this.handleError)
    );
  }

  public createContactRequest(request: ContactRequestCreation): Observable<ContactRequest> {
    const url = `${this.baseUrl}/contact-request`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.post<ContactRequest>(url, request, { headers })),
      catchError(this.handleError)
    );
  }

  public getAllUserContactRequests(userId: string): Observable<ContactRequest[]> {
    const url = `${this.baseUrl}/${userId}/sent-contact-requests`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.get<ContactRequest[]>(url, { headers })),
      catchError(this.handleError)
    );
  }

  public getReceivedContactRequests(userId: string): Observable<ContactRequest[]> {
    const url = `${this.baseUrl}/${userId}/received-contact-requests`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.get<ContactRequest[]>(url, { headers })),
      catchError(this.handleError)
    );
  }

  public acceptContactRequest(contactRequest: ContactRequest): Observable<Contact> {
    const url = `${this.baseUrl}/received-contact-requests/accept`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.patch<Contact>(url, contactRequest, { headers })),
      catchError(this.handleError)
    );
  }

  public refuseContactRequest(contactRequest: ContactRequest): Observable<boolean> {
    const url = `${this.baseUrl}/received-contact-requests/refuse`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.patch<boolean>(url, contactRequest, { headers })),
      catchError(this.handleError)
    );
  }

  public cancelSentContactRequest(contactRequestId: string): Observable<boolean> {
    const url = `${this.baseUrl}/sent-contact-requests/cancel/${contactRequestId}`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.delete<boolean>(url, { headers })),
      catchError(this.handleError)
    );
  }

  public sendContactRequest(senderId: string, receiverId: string, relationType: string): Observable<ContactRequest> {
    const url = `${this.baseUrl}/contact-request`;
    const requestPayload = {
      senderId: senderId,
      receiverId: receiverId,
      relationTypeName: relationType
    };
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.post<ContactRequest>(url, requestPayload, { headers })),
      catchError(this.handleError)
    );
  }

  public getContactSuggestions(userId: string): Observable<UserInfo[]> {
    const url = `${this.baseUrl}/${userId}/suggested-contact`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.get<UserInfo[]>(url, { headers })),
      catchError(this.handleError)
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
    console.error('An error occurred:', error);
    return throwError(() => new Error('An error occurred; please try again later.'));
  }
}