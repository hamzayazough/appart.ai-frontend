import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AccommodationMatchingDTO } from '../../../intefaces/accommodation.interface';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { AccommodationsService } from '../../../services/accomodations/accomodations.service';
import { Subscription } from 'rxjs';

enum SelectedHeader {
  home = 'home',
  map = 'map',
  roommate = 'roommate',
  profile = 'profile',
}

@Component({
  selector: 'app-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrl: './map-sidebar.component.scss',
})
export class MapSidebarComponent implements OnInit, OnDestroy {
  data: AccommodationMatchingDTO[] = [];
  @Input() matchingFeature = false;
  @Input() opened = true;
  @Output() sidebarToggle = new EventEmitter<void>();

  public selected: SelectedHeader = SelectedHeader.map;
  public selectedHeader = SelectedHeader;

  public currentPage = 0;
  public itemsPerPage = 20;
  public totalItems = 0;
  public isLoading = false;

  private userId: string | undefined = undefined;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private accommodationService: AccommodationsService,
    private userRelatedAccommodationsService: AccommodationsService
  ) {}

  ngOnInit(): void {
    this.subscribeToLoggedUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get totalPages(): number {
    return Math.max(Math.ceil(this.totalItems / this.itemsPerPage), 1);
  }

  public toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  public prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAccommodations();
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAccommodations();
    }
  }

  public goToProfile(): void {
    if (this.userId) {
      this.router.navigate([`/account/${this.userId}`]);
      this.selected = SelectedHeader.profile;
    } else {
      this.router.navigate(['/login']);
    }
  }

  public goToHomePage(): void {
    this.router.navigate([`/home`]);
    this.selected = SelectedHeader.home;
  }

  public onBrowseClick(): void {
    if (this.userId) {
      this.router.navigate([`/map/authenticated`]);
    } else {
      this.router.navigate(['/home']);
    }
    this.selected = SelectedHeader.map;
  }

  public goToRoommates(): void {
    if (this.userId) {
      this.router.navigate([`/r`]);
      this.selected = SelectedHeader.roommate;
    } else {
      this.router.navigate(['/login']);
    }
  }

  private subscribeToLoggedUser(): void {
    const subscription = this.authService.loggedUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        this.loadAccommodations();
      } else {
        this.userId = undefined;
        this.data = [];
      }
    });
    this.subscriptions.add(subscription);
  }

  private loadAccommodations(): void {
    if (!this.userId) return;

    this.isLoading = true;
    const subscription = this.userRelatedAccommodationsService
      .getRecentMatchingAccommodations(this.userId, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (data) => {
          console.log('Accommodations loaded:', data);
          this.data = data;
          if (data.length < this.itemsPerPage) {
            this.totalItems = this.currentPage * this.itemsPerPage + data.length;
          } else {
            this.totalItems = (this.currentPage + 1) * this.itemsPerPage + 1;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.log('Error loading accommodations:', error);
          console.error('Error loading accommodations:', error);
          this.isLoading = false;
        },
      });
    this.subscriptions.add(subscription);
  }
}
