import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact, ContactRequest, ContactRequestCreation } from '../../intefaces/contact.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from '../user-service/user.service';
import { AppUser, UserInfo } from '../../intefaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = '/protected/api/user';
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) { }

  public getUserContacts(userId: string, token: string): Observable<Contact[]> {
    const url = `${this.baseUrl}/${userId}/contact`;
    const headers = this.getAuthHeaders(token);
    return this.http.get<Contact[]>(url, { headers });
  }

  public removeContact(userId: string, contactId: string, token: string): Observable<boolean> {
    const url = `${this.baseUrl}/${userId}/contact/${contactId}`;
    const headers = this.getAuthHeaders(token);
    return this.http.delete<boolean>(url, { headers });
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

  public acceptContactRequest(contactRequest: ContactRequest, token: string): Observable<Contact> {
    const url = `${this.baseUrl}/received-contact-requests/accept`;
    const headers = this.getAuthHeaders(token);
    return this.http.patch<Contact>(url, contactRequest, { headers });
  }
  
  public refuseContactRequest( contactRequest: ContactRequest, token: string): Observable<boolean> {
    const url = `${this.baseUrl}/received-contact-requests/refuse`;
    const headers = this.getAuthHeaders(token);
    return this.http.patch<boolean>(url, contactRequest, { headers });
  }

  public cancelSentContactRequest(contactRequestId: string, token: string): Observable<boolean> {
    const url = `${this.baseUrl}/sent-contact-requests/cancel/${contactRequestId}`;
    const headers = this.getAuthHeaders(token);
    return this.http.delete<boolean>(url, { headers });
  }
  public sendContactRequest(senderId: string, receiverId: string, relationType: string, token: string): Observable<ContactRequest> {
    const url = `${this.baseUrl}/contact-request`;
    const headers = this.getAuthHeaders(token);
    const requestPayload = {
      senderId: senderId,
      receiverId: receiverId,
      relationTypeName: relationType
    };
    console.log(requestPayload);
    return this.http.post<ContactRequest>(url, requestPayload, { headers });
  }

  public getContactSuggestions(userId: string, token: string): Observable<UserInfo[]> {
    const url = `${this.baseUrl}/${userId}/suggested-contact`;
    const headers = this.getAuthHeaders(token);
    return this.http.get<UserInfo[]>(url, { headers });
  }

  public getUser(): AppUser | null {
    return this.userService.getStoredUser();
  }
  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

}
