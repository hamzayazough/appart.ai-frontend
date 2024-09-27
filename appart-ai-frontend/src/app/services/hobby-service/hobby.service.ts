import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Hobby, NewHobby } from '../../intefaces/hobby.interface';

@Injectable({
  providedIn: 'root'
})
export class HobbyService {
  private apiUrl = '/protected/api/user';
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(private http: HttpClient) { }

  public getAllUserHobbies(userId: string, token: string): Observable<Hobby[]> {
    const url = `${this.baseUrl}/${userId}/hobbies`;
    const headers = this.getAuthHeaders(token);
    return this.http.get<Hobby[]>(url, { headers });
  }

  public updateUserHobby(userId: string, hobby: Hobby, token: string): Observable<Hobby> {
    const url = `${this.baseUrl}/${userId}/hobby`;
    const headers = this.getAuthHeaders(token);
    return this.http.put<Hobby>(url, hobby, { headers });
  }

  public deleteUserHobby(userId: string, hobbyId: string, token: string): Observable<boolean> {
    const url = `${this.baseUrl}/${userId}/hobby/${hobbyId}`;
    const headers = this.getAuthHeaders(token);
    return this.http.delete<boolean>(url, { headers });
  }

  public addUserHobby(userId: string, hobby: NewHobby, token: string): Observable<Hobby> {
    const url = `${this.baseUrl}/${userId}/hobby`;
    const headers = this.getAuthHeaders(token);
    return this.http.post<Hobby>(url, hobby, { headers });
  }

  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}