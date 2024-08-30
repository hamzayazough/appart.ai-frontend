import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUser } from '../../intefaces/user.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/protected/api/user'
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(private http: HttpClient) { }

  createUserIfDontExist(user: AppUser, token: string): Observable<AppUser> {
    const url = `${this.baseUrl}/create-user-if-not-exist`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<AppUser>(url, user, { headers });
  }
}
