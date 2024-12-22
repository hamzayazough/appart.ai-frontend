import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RoommateService } from '../../../services/roommate/roommate.service';
import { UserService } from '../../../services/user-service/user.service';
import { RoommatePost, RoommatePostInfo } from '../../../intefaces/roommate.interface';
import { SelectedHeader } from '../../../enums/selected-header.enum';
import { filter } from 'rxjs';

@Component({
  selector: 'app-roommates-page',
  templateUrl: './roommates-page.component.html',
  styleUrls: ['./roommates-page.component.scss']
})
export class RoommatesPageComponent implements OnInit {
  public selectedHeader = SelectedHeader.roommates;
  public hasDoneARequest: boolean = false;
  public hasChildRoute: boolean = false;
  public roommatePosts: RoommatePostInfo[] = [];
  public myRoommateRequest: RoommatePost | null = null;
  private token: string | null = localStorage.getItem('token');
  private storedUser = this.userService.getStoredUser();


  constructor(
    private roommateService: RoommateService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.token || !this.storedUser?.id) {
      alert("You need to be logged in to access this page");
      return;
    }

    this.updateHasChildRoute();

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.updateHasChildRoute();
    });
  }

  public loadRoommateRequests(): void {
    const userId = this.storedUser?.id;
    if (!this.token || !userId) {
      alert("You need to be logged in to do this");
      return;
    }
    this.roommateService.getPosts(userId, this.token).subscribe((posts: RoommatePostInfo[]) => {
      this.roommatePosts = posts;
    });
  }


  public goToMyRequest(): void {
    if (this.myRoommateRequest) {
      this.roommateService.setMyRoommateRequest(this.myRoommateRequest);
      this.router.navigate([`/r/edit/${this.myRoommateRequest.userId}`]);
      return;
    }
    this.router.navigate([`/r/create-post`]);
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

  private updateHasChildRoute(): void {
    this.hasChildRoute = !!this.route.firstChild;
  }
}