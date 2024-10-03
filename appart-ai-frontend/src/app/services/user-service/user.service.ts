import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUser, UserInfo } from '../../intefaces/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../auth/authentication.service';
import { UserPreferences } from '../../intefaces/user-preferences.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/protected/api/user'
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(private http: HttpClient) {
   }


  public createUserIfDontExist(user: AppUser, token: string): Observable<AppUser> {
    const url = `${this.baseUrl}/create-user-if-not-exist`;
    const headers = this.getAuthHeaders(token);
    return this.http.post<AppUser>(url, user, { headers });
  }

  public changeUserInfo(userId: string, userInfo: UserInfo, token: string): Observable<AppUser> {
    const url = `${this.baseUrl}/${userId}`;
    const headers = this.getAuthHeaders(token);
    return this.http.patch<AppUser>(url, userInfo, { headers });
  }

  public validateNewUserName(userId: string, newUserName: string, token: string): Observable<boolean> {
    const url = `${this.baseUrl}/${userId}/new-user-name/${newUserName}`;
    const headers = this.getAuthHeaders(token);
    return this.http.get<boolean>(url, { headers });
  }

  public getStoredUser(): AppUser | null {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }



  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  public createUserPreferences(preferences: UserPreferences, userId: string, token: string): Observable<UserPreferences> {
    const url = `${this.baseUrl}/user-preferences/create/${userId}`;
    const headers = this.getAuthHeaders(token);
    return this.http.post<UserPreferences>(url, preferences, { headers });
  }

  public updateUserPreferences(userId: string, preferences: UserPreferences, token: string): Observable<UserPreferences> {
    const url = `${this.baseUrl}/user-preferences/update/${userId}`;
    const headers = this.getAuthHeaders(token);
    return this.http.put<UserPreferences>(url, preferences, { headers });
  }


  public getUserPreferences(userId: string, token: string): Observable<UserPreferences> {
    const url = `${this.baseUrl}/user-preferences/${userId}`;
    const headers = this.getAuthHeaders(token);
    return this.http.get<UserPreferences>(url, { headers });
  }
}
