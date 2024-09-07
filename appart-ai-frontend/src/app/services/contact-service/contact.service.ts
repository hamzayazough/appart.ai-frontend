import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact, ContactRequest, ContactRequestCreation } from '../../intefaces/contact.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = '/protected/api/user';
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(private http: HttpClient) { }

  public getUserContacts(userId: string, token: string): Observable<Contact[]> {
    const url = `${this.baseUrl}/${userId}/contact`;
    const headers = this.getAuthHeaders(token);
    return this.http.get<Contact[]>(url, { headers });
  }

  public createContactRequest(request: ContactRequestCreation, token: string): Observable<ContactRequest> {
    const url = `${this.baseUrl}/contact-request`;
    const headers = this.getAuthHeaders(token);
    return this.http.post<ContactRequest>(url, request, { headers });
  }

  public getAllUserContactRequests(userId: string, token: string): Observable<ContactRequest[]> {
    const url = `${this.baseUrl}/${userId}/sent-contact-requests`;
    const headers = this.getAuthHeaders(token);
    return this.http.get<ContactRequest[]>(url, { headers });
  }

  public getReceivedContactRequests(userId: string, token: string): Observable<ContactRequest[]> {
    const url = `${this.baseUrl}/${userId}/received-contact-requests`;
    const headers = this.getAuthHeaders(token);
    return this.http.get<ContactRequest[]>(url, { headers });
  }

  public acceptContactRequest(userId: string, contactRequest: ContactRequest, token: string): Observable<Contact> {
    const url = `${this.baseUrl}/${userId}/received-contact-requests/accept`;
    const headers = this.getAuthHeaders(token);
    return this.http.patch<Contact>(url, contactRequest, { headers });
  }
  
  public refuseContactRequest(userId: string, contactRequest: ContactRequest, token: string): Observable<boolean> {
    const url = `${this.baseUrl}/${userId}/received-contact-requests/refuse`;
    const headers = this.getAuthHeaders(token);
    return this.http.patch<boolean>(url, contactRequest, { headers });
  }

  public cancelSentContactRequest(userId: string, contactRequestId: string, token: string): Observable<boolean> {
    const url = `${this.baseUrl}/${userId}/sent-contact-requests/cancel/${contactRequestId}`;
    const headers = this.getAuthHeaders(token);
    return this.http.delete<boolean>(url, { headers });
  }

  public getContactSuggestions(userId: string, token: string): Observable<Contact[]> {
    const url = `${this.baseUrl}/${userId}/suggested-contact`;
    const headers = this.getAuthHeaders(token);
    return this.http.get<Contact[]>(url, { headers });
  }

  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
