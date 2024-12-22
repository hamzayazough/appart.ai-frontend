import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserService } from '../user-service/user.service';
import { RoomatePost } from '../../intefaces/roomate.interface';
import { Observable } from 'rxjs';
import { UserInfo } from '../../intefaces/user.interface';
import { RoomatePostInfo } from '../../intefaces/roomate-post-info.interface';

@Injectable({
  providedIn: 'root'
})
export class RoomateService {
  private apiUrl = '/protected/api/roomate'
  private baseUrl: string = environment.apiUrl + this.apiUrl;
  private myRoomateRequest: RoomatePost | null = null;

  constructor(private http: HttpClient, private userService: UserService) {
   }

  getMyRoomateRequest(userId: string, token: string): Observable<RoomatePost | null> {
    const url = `${this.baseUrl}/user/${userId}/request`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.get<RoomatePost | null>(url, { headers });
  }
  addRoomateRequest(roomateRequestDTO: RoomatePost, token: string): Observable<RoomatePost> {
    const url = `${this.baseUrl}/add-request`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.post<RoomatePost>(url, roomateRequestDTO, { headers });
  }

  updateRoomateRequest(requestId: string, roomateRequestDTO: RoomatePost, token: string): Observable<RoomatePost> {
    const url = `${this.baseUrl}/update-request/${requestId}`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.patch<RoomatePost>(url, roomateRequestDTO, { headers });
  }

  deleteRoomateRequest(requestId: string, token: string): Observable<void> {
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

  getPosts(userId: string, token: string, limit: number = 10, lastPostId?: string): Observable<RoomatePostInfo[]> {
    const url = `${this.baseUrl}/posts?userId=${userId}&limit=${limit}${lastPostId ? `&lastPostId=${lastPostId}` : ''}`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.get<RoomatePostInfo[]>(url, { headers });
  }

  swipe(userId: string, postId: string, swipeType: string, token: string): Observable<void> {
    const url = `${this.baseUrl}/swipe?userId=${userId}&postId=${postId}&swipeType=${swipeType}`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.post<void>(url, null, { headers });
  }

  getNextPosts(userId: string, token: string, limit: number = 10): Observable<RoomatePostInfo[]> {
    const url = `${this.baseUrl}/next-posts?userId=${userId}&limit=${limit}`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.get<RoomatePostInfo[]>(url, { headers });
  }

  setMyRoomateRequest(myRequest: RoomatePost): void {
    this.myRoomateRequest = myRequest;
  }
  
}
