import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserService } from '../user-service/user.service';
import { RoomateRequest, RoomateRequestSummary } from '../../intefaces/roomate.interface';
import { Observable } from 'rxjs';
import { UserInfo } from '../../intefaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class RoomateService {
  private apiUrl = '/protected/api/roomate'
  private baseUrl: string = environment.apiUrl + this.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) {
   }

  getMyRoomateRequest(userId: string, token: string): Observable<RoomateRequest | null> {
    const url = `${this.baseUrl}/user/${userId}/request`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.get<RoomateRequest | null>(url, { headers });
  }
  addRoomateRequest(roomateRequestDTO: RoomateRequest, token: string): Observable<RoomateRequest> {
    const url = `${this.baseUrl}/add-request`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.post<RoomateRequest>(url, roomateRequestDTO, { headers });
  }

  updateRoomateRequest(requestId: string, roomateRequestDTO: RoomateRequest, token: string): Observable<RoomateRequest> {
    const url = `${this.baseUrl}/update-request/${requestId}`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.patch<RoomateRequest>(url, roomateRequestDTO, { headers });
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

  getRecentRoomateRequests(page: number = 0, size: number = 20, token: string): Observable<RoomateRequestSummary[]> {
    const url = `${this.baseUrl}/recent-requests?page=${page}&size=${size}`;
    const headers = this.userService.getAuthHeaders(token);
    return this.http.get<RoomateRequestSummary[]>(url, { headers });
  }
}
