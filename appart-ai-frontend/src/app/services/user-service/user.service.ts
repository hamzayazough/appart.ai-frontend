import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUser, UserInfo } from '../../intefaces/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../auth/authentication.service';

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


}
