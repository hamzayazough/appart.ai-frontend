import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppUser } from '../../intefaces/user.interface';
import { Accommodation } from '../../intefaces/accommodation.interface';
import { AccommodationManagingService } from '../../services/accommodation-managing/accommodation-managing.service';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectedHeader } from '../../enums/selected-header.enum';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { AccommodationStateService } from '../../services/accommodation-state/accommodation-state.service';

@Component({
  selector: 'app-accommodation-management-page',
  templateUrl: './accommodation-management-page.component.html',
  styleUrls: ['./accommodation-management-page.component.scss'],
})
export class AccommodationManagementPageComponent implements OnInit, OnDestroy {
  user: AppUser = {} as AppUser;
  accommodations: Accommodation[] = [];
  public selectedHeader = SelectedHeader.myProfile;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private authService: AuthenticationService,
    private accommodationService: AccommodationManagingService,
    private accommodationStateService: AccommodationStateService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public viewAccommodation(accommodation: Accommodation): void {
    //TODO: implémenter la page d'appartement
  }

  public addAccommodation(): void {
    if (this.isProfileValid()) {
      this.router.navigate(['/account', this.user.id, 'accommodations-manager', 'new']);
    }
  }

  public editAccommodation(accommodation: Accommodation): void {
    this.accommodationStateService.setCurrentAccommodation(accommodation);
    this.router.navigate(['/account', this.user.id, 'accommodations-manager', accommodation.id]);
  }

  public deleteAccommodation(accommodationId: string): void {
    if (confirm('Are you sure you want to delete this accommodation?')) {
      this.accommodationService.deleteAccommodation(accommodationId).subscribe({
        next: () => {
          this.snackBar.open('Accommodation deleted successfully', 'Close', { duration: 3000 });
          this.loadAccommodations();
        },
        error: () => {
          this.snackBar.open('Failed to delete accommodation', 'Close', { duration: 3000 });
        },
      });
    }
  }

  private isProfileValid(): boolean {
    if (this.user.type !== 'landlord') {
      this.snackBar.open('You must be a landlord to create an accommodation', 'Close', {
        duration: 3000,
      });
      return false;
    }
    if (!this.user.phone || !this.user.email) {
      this.snackBar.open(
        'Please update your profile with a phone number and email to create an accommodation',
        'Close',
        { duration: 3000 }
      );
      return false;
    }
    return true;
  }

  private initializeData(): void {
    this.authService.loggedUser$.pipe(takeUntil(this.unsubscribe$)).subscribe((user) => {
      if (!user.id) {
        this.authService.handleUnAuthorizedUser();
      } else {
        this.user = user;
        this.loadAccommodations();
      }
    });
  }

  private loadAccommodations(): void {
    this.accommodationService.getLandlordAccommodations(this.user.id).subscribe({
      next: (accommodations: Accommodation[]) => {
        this.accommodations = accommodations;
      },
      error: (error) => {
        this.snackBar.open(`Failed to load accommodations:  ${error}`, 'Close', { duration: 3000 });
      },
    });
  }
}
