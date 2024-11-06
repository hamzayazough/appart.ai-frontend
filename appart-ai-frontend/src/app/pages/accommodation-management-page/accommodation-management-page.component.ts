import { Component, OnInit } from '@angular/core';
import { AppUser } from '../../intefaces/user.interface';
import { Accommodation } from '../../intefaces/accommodation.interface';
import { AccommodationManagingService } from '../../services/accommodation-managing/accommodation-managing.service';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AccommodationCreationDialogComponent } from './dialog-components/accommodation-creation-dialog/accommodation-creation-dialog.component';
import { SelectedHeader } from '../../enums/selected-header.enum';

@Component({
  selector: 'app-accommodation-management-page',
  templateUrl: './accommodation-management-page.component.html',
  styleUrls: ['./accommodation-management-page.component.scss']
})
export class AccommodationManagementPageComponent implements OnInit {
  user: AppUser = {} as AppUser;
  token: string | null = null;
  accommodations: Accommodation[] = [];
  public selectedHeader = SelectedHeader.myProfile;

  constructor(
    private authService: AuthenticationService,
    private accommodationService: AccommodationManagingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscribeToUserAndToken();
  }

  private subscribeToUserAndToken(): void {
    this.authService.loggedUser.subscribe((user: AppUser) => {
      this.user = user;
      if (this.token) {
        this.loadAccommodations();
      }
    });
    this.authService.token.subscribe((token: string) => {
      this.token = token;
    });
  }

  private loadAccommodations(): void {
    if (this.token && this.user.id) {
      this.accommodationService.getLandlordAccommodations(this.user.id, this.token)
        .subscribe((accommodation) => {
          this.accommodations = accommodation;
          this.accommodations.forEach((acc) => {
            });
        }, (error) => {
          this.snackBar.open('Failed to load accommodations', 'Close', { duration: 3000 });
        });
    }
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
        if (result && this.token) {
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

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.token) {
        this.accommodationService.updateAccommodation(accommodation.id, result, this.token)
          .subscribe(() => {
            this.snackBar.open('Accommodation updated successfully', 'Close', { duration: 3000 });
            this.loadAccommodations();
          }, () => {
            this.snackBar.open('Failed to update accommodation', 'Close', { duration: 3000 });
          });
      }
    });
  }

  public deleteAccommodation(accommodationId: string): void {
    if (this.token) {
      this.accommodationService.deleteAccommodation(accommodationId, this.token)
        .subscribe(() => {
          this.snackBar.open('Accommodation deleted successfully', 'Close', { duration: 3000 });
          this.loadAccommodations();
        }, () => {
          this.snackBar.open('Failed to delete accommodation', 'Close', { duration: 3000 });
        });
    }
  }

  private isProfileValid(): boolean {
    if (!this.user || !this.user.id) {
      this.snackBar.open('Please login to create an accommodation', 'Close', { duration: 3000 });
      return false;
    }
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
}
