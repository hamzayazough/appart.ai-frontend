import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserService } from '../user-service/user.service';
import { RoommatePost, RoommatePostInfo } from '../../intefaces/roommate.interface';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoommateService {
  private apiUrl = '/protected/api/roommate';
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) {}

  public getMyRoommateRequest(userId: string): Observable<RoommatePost | null> {
    const url = `${this.baseUrl}/user/${userId}/request`;
    return this.userService.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<RoommatePost | null>(url, { headers })
      )
    );
  }

  public addRoommateRequest(roommateRequestDTO: RoommatePost): Observable<RoommatePost> {
    const url = `${this.baseUrl}/add-request`;
    return this.userService.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<RoommatePost>(url, roommateRequestDTO, { headers })
      )
    );
  }

  public updateRoommateRequest(
    requestId: string,
    roommateRequestDTO: RoommatePost
  ): Observable<RoommatePost> {
    const url = `${this.baseUrl}/update-request/${requestId}`;
    return this.userService.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.patch<RoommatePost>(url, roommateRequestDTO, { headers })
      )
    );
  }

  public deleteRoommateRequest(requestId: string): Observable<void> {
    const url = `${this.baseUrl}/delete-request/${requestId}`;
    return this.userService.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.delete<void>(url, { headers })
      )
    );
  }

  public getPosts(
    userId: string,
    limit = 10,
    lastPostId?: string
  ): Observable<RoommatePostInfo[]> {
    const url = `${this.baseUrl}/posts?userId=${userId}&limit=${limit}${
      lastPostId ? `&lastPostId=${lastPostId}` : ''
    }`;
    return this.userService.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<RoommatePostInfo[]>(url, { headers })
      )
    );
  }

  public swipe(
    userId: string,
    postId: string,
    swipeType: string
  ): Observable<void> {
    const url = `${this.baseUrl}/swipe?userId=${userId}&postId=${postId}&swipeType=${swipeType}`;
    return this.userService.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<void>(url, null, { headers })
      )
    );
  }

  public updateRoommateRequestStatus(
    requestId: string,
    isActive: boolean
  ): Observable<void> {
    const url = `${this.baseUrl}/update-status/${requestId}`;
    return this.userService.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.patch<void>(url, { isActive }, { headers })
      )
    );
  }
}
