import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserService } from '../user-service/user.service';
import { RoommatePost, RoommatePostInfo } from '../../intefaces/roommate.interface';
import { Observable } from 'rxjs';
import { UserInfo } from '../../intefaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class RoommateService {
  private apiUrl = '/protected/api/roommate'
  private baseUrl: string = environment.apiUrl + this.apiUrl;
  private myRoommateRequest: RoommatePost | null = null;

  constructor(private http: HttpClient, private userService: UserService) {
   }

  getMyRoommateRequest(userId: string, token: string): Observable<RoommatePost | null> {
    const url = `${this.baseUrl}/user/${userId}/request`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.get<RoommatePost | null>(url, { headers });
  }
  addRoommateRequest(roommateRequestDTO: RoommatePost, token: string): Observable<RoommatePost> {
    const url = `${this.baseUrl}/add-request`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.post<RoommatePost>(url, roommateRequestDTO, { headers });
  }

  updateRoommateRequest(requestId: string, roommateRequestDTO: RoommatePost, token: string): Observable<RoommatePost> {
    const url = `${this.baseUrl}/update-request/${requestId}`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.patch<RoommatePost>(url, roommateRequestDTO, { headers });
  }

  deleteRoommateRequest(requestId: string, token: string): Observable<void> {
    const url = `${this.baseUrl}/delete-request/${requestId}`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.delete<void>(url, { headers });
  }
  addInterest(requestId: string, userId: string, token: string): Observable<void> {
    const url = `${this.baseUrl}/${requestId}/interest?userId=${userId}`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.post<void>(url, null, { headers });
  }

  getInterestedUsers(requestId: string, token: string): Observable<UserInfo[]> {
    const url = `${this.baseUrl}/${requestId}/interested-users`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.get<UserInfo[]>(url, { headers });
  }

  getPosts(userId: string, token: string, limit: number = 10, lastPostId?: string): Observable<RoommatePostInfo[]> {
    const url = `${this.baseUrl}/posts?userId=${userId}&limit=${limit}${lastPostId ? `&lastPostId=${lastPostId}` : ''}`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.get<RoommatePostInfo[]>(url, { headers });
  }

  swipe(userId: string, postId: string, swipeType: string, token: string): Observable<void> {
    const url = `${this.baseUrl}/swipe?userId=${userId}&postId=${postId}&swipeType=${swipeType}`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.post<void>(url, null, { headers });
  }

  getNextPosts(userId: string, token: string, limit: number = 10): Observable<RoommatePostInfo[]> {
    const url = `${this.baseUrl}/next-posts?userId=${userId}&limit=${limit}`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.get<RoommatePostInfo[]>(url, { headers });
  }

  setMyRoommateRequest(myRequest: RoommatePost): void {
    this.myRoommateRequest = myRequest;
  }
  
}
