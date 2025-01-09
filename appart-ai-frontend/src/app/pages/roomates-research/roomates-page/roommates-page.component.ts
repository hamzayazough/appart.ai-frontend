import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RoommateService } from '../../../services/roommate/roommate.service';
import { UserService } from '../../../services/user-service/user.service';
import { RoommatePost, RoommatePostInfo } from '../../../intefaces/roommate.interface';
import { SelectedHeader } from '../../../enums/selected-header.enum';
import { filter, Subscription } from 'rxjs';
import { TokenService } from '../../../services/token-service/token.service';

@Component({
  selector: 'app-roommates-page',
  templateUrl: './roommates-page.component.html',
  styleUrls: ['./roommates-page.component.scss']
})
export class RoommatesPageComponent implements OnInit, OnDestroy {
  public selectedHeader = SelectedHeader.roommates;
  public hasChildRoute: boolean = false;
  private routerSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initializeComponent();

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateHasChildRoute();
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  private async initializeComponent(): Promise<void> {
    try {
      this.updateHasChildRoute();
    } catch (error) {
      console.error('Error initializing RoommatesPageComponent:', error);
      alert('An error occurred. Please try again later.');
    }
  }

  private updateHasChildRoute(): void {
    this.hasChildRoute = !!this.route.firstChild;
  }

  public searchRoommates(): void {
    this.router.navigate([`/r/research`]);
  }

  public goToMyRequest(): void {
    this.router.navigate([`/r/create-post`]);
  }
}