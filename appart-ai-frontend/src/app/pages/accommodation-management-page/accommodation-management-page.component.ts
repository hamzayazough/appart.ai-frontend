import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppUser } from '../../intefaces/user.interface';
import { Accommodation } from '../../intefaces/accommodation.interface';
import { AccommodationManagingService } from '../../services/accommodation-managing/accommodation-managing.service';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AccommodationCreationDialogComponent } from './dialog-components/accommodation-creation-dialog/accommodation-creation-dialog.component';
import { SelectedHeader } from '../../enums/selected-header.enum';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-accommodation-management-page',
  templateUrl: './accommodation-management-page.component.html',
  styleUrls: ['./accommodation-management-page.component.scss']
})
export class AccommodationManagementPageComponent implements OnInit, OnDestroy {
  user: AppUser = {} as AppUser;
  accommodations: Accommodation[] = [];
  public selectedHeader = SelectedHeader.myProfile;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private authService: AuthenticationService,
    private accommodationService: AccommodationManagingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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
    if (this.isProfileValid()){
      const dialogRef = this.dialog.open(AccommodationCreationDialogComponent, {
        width: '70%',
        data: { isNew: true }
      });
  
      dialogRef.afterClosed().subscribe((result: Accommodation) => {
        if (result) {
          this.accommodations.push(result);
        }
      });
    }
  }

  public editAccommodation(accommodation: Accommodation): void {
    const dialogRef = this.dialog.open(AccommodationCreationDialogComponent, {
      width: '70%',
      height: '80%',
      data: { accommodation }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.accommodationService.updateAccommodation(accommodation.id, result).subscribe({
            next: () => {
              this.snackBar.open('Accommodation updated successfully', 'Close', { duration: 3000 });
              this.loadAccommodations();
            },
            error: () => {
              this.snackBar.open('Failed to update accommodation', 'Close', { duration: 3000 });
            },
          });
        }
      },
      error: () => {
        this.snackBar.open('Something went wrong with the dialog', 'Close', { duration: 3000 });
      },
    });    
  }

  public deleteAccommodation(accommodationId: string): void {
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

  private isProfileValid(): boolean {
    if(this.user.type !== 'landlord') {
      this.snackBar.open('You must be a landlord to create an accommodation', 'Close', { duration: 3000 });
      return false;
    }
    if(!this.user.phone || !this.user.email) {
      this.snackBar.open('Please update your profile with a phone number and email to create an accommodation', 'Close', { duration: 3000 });
      return false;
    }
    return true;
  }

  private initializeData(): void {
    this.authService.loggedUser$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((user) => {
      if (!user.id) {
        this.authService.handleUnAuthorizedUser();
      } else {
        this.user = user;
        this.loadAccommodations();
      }
    });
  }

  private loadAccommodations(): void {
    this.accommodationService.getLandlordAccommodations(this.user.id)
      .subscribe({
        next: (accommodations) => {
          this.accommodations = accommodations;
        },
        error: (error) => {
          this.snackBar.open(`Failed to load accommodations:  ${error}`, 'Close', { duration: 3000 });
        },
      });
  }
}
