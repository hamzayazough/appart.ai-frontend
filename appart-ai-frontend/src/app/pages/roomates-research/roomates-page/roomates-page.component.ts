import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomateService } from '../../../services/roomate/roomate.service';
import { UserService } from '../../../services/user-service/user.service';
import { RoomateRequest, RoomateRequestSummary } from '../../../intefaces/roomate.interface';
import { PageEvent } from '@angular/material/paginator';
import { SelectedHeader } from '../../../enums/selected-header.enum';

@Component({
  selector: 'app-roomates-page',
  templateUrl: './roomates-page.component.html',
  styleUrls: ['./roomates-page.component.scss']
})
export class RoomatesPageComponent implements OnInit {
  public selectedHeader = SelectedHeader.roomates;
  public hasDoneARequest: boolean = false;
  public roomateRequests: RoomateRequestSummary[] = [];
  public myRoomateRequest: RoomateRequest | null = null;
  private token: string | null = localStorage.getItem('token');
  private storedUser = this.userService.getStoredUser();
  public pageSize = 10;
  public pageIndex = 0;
  public searchQuery: string = '';

  constructor(
    private roomateService: RoomateService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.token || !this.storedUser?.id) {
      alert("You need to be logged in to access this page");
      return;
    }

    this.roomateService.getMyRoomateRequest(this.storedUser.id, this.token).subscribe((myRequest: RoomateRequest | null) => {
      if (myRequest) {
        this.hasDoneARequest = true;
        this.myRoomateRequest = myRequest;
      }
    });

    this.loadRoomateRequests();
  }

  public loadRoomateRequests(): void {
    if (!this.token) {
      alert("You need to be logged in to do this");
      return;
    }
    this.roomateService.getRecentRoomateRequests(this.pageIndex, this.pageSize, this.token).subscribe((requests: RoomateRequestSummary[]) => {
      this.roomateRequests = requests;
    });
  }

  public searchRoommates(): void {
    // Implémentez la logique de recherche ici
  }

  public onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRoomateRequests();
  }

  public goToMyRequest(): void {
    if (this.myRoomateRequest) {
      this.router.navigate([`/r/${this.myRoomateRequest.id}`]);
    }
  }

  public editRequest(): void {
    if(!this.token ||!this.storedUser?.id) {
      return;
    }
    this.router.navigate(['/r/edit/{this.storedUser.id}']);
  }

  public viewRequestDetails(requestId: string): void {
    this.router.navigate([`/r/${requestId}`]);
  }
}