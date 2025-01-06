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
  public hasChildRoute: boolean = false;
  private token: string | null = localStorage.getItem('token');
  private storedUser = this.userService.getStoredUser();


  constructor(
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

  public searchRoommates(): void {
    console.log('searchRoommates');
    this.router.navigate([`/r/research`]);
  }


  public goToMyRequest(): void {
    this.router.navigate([`/r/create-post`]);
  }



  private updateHasChildRoute(): void {
    this.hasChildRoute = !!this.route.firstChild;
  }
}