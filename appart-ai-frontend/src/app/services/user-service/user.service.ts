import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUser, UserInfo } from '../../intefaces/user.interface';
import { BehaviorSubject, catchError, from, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserPreferences } from '../../intefaces/user-preferences.interface';
import { TokenService } from '../token-service/token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/protected/api/user';
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public getAuthHeaders(): Observable<HttpHeaders> {
    return this.tokenService.getToken$().pipe(
      switchMap((token) => {
        if (!token) {
          throw new Error('Token is not available. Please log in.');
        }
        return of(new HttpHeaders().set('Authorization', `Bearer ${token}`));
      })
    );
  }

  public createUserIfDontExist(user: AppUser): Observable<AppUser> {
    const url = `${this.baseUrl}/create-user-if-not-exist`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<AppUser>(url, user, { headers })
      )
    );
  }

  public changeUserInfo(userId: string, userInfo: UserInfo): Observable<AppUser> {
    const url = `${this.baseUrl}/${userId}`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.patch<AppUser>(url, userInfo, { headers })
      )
    );
  }

  public validateNewUserName(userId: string, newUserName: string): Observable<boolean> {
    const url = `${this.baseUrl}/${userId}/new-user-name/${newUserName}`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<boolean>(url, { headers })
      )
    );
  }

  public createUserPreferences(preferences: UserPreferences, userId: string): Observable<UserPreferences> {
    const url = `${this.baseUrl}/user-preferences/create/${userId}`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<UserPreferences>(url, preferences, { headers })
      )
    );
  }

  public updateUserPreferences(userId: string, preferences: UserPreferences): Observable<UserPreferences> {
    const url = `${this.baseUrl}/user-preferences/update/${userId}`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.put<UserPreferences>(url, preferences, { headers })
      )
    );
  }

  public getUserPreferences(userId: string): Observable<UserPreferences | null> {
    const url = `${this.baseUrl}/user-preferences/${userId}`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<UserPreferences>(url, { headers }).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 404) {
              console.warn('User preferences not found.');
              return of(null);
            }
            return throwError(() => error);
          })
        )
      )
    );
  }


}