import { Component, OnInit } from '@angular/core';
import { AppUser } from '../../intefaces/user.interface';
import { AccommodationCreation, Accommodation } from '../../intefaces/accommodation.interface';
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
      if (this.user) {
        this.loadAccommodations();
      }
    });
  }

  private loadAccommodations(): void {
    if (this.token && this.user.id) {
      this.accommodationService.getLandlordAccommodations(this.user.id, this.token)
        .subscribe((accommodation) => {
          console.log(accommodation);
          this.accommodations = accommodation;
        }, (error) => {
          this.snackBar.open('Failed to load accommodations', 'Close', { duration: 3000 });
        });
    }
  }

  public viewAccommodation(accommodation: Accommodation): void {
    console.log(accommodation);
  }

  public addAccommodation(): void {
    const dialogRef = this.dialog.open(AccommodationCreationDialogComponent, {
      width: '400px',
      data: { isNew: true }
    });

    dialogRef.afterClosed().subscribe((result: Accommodation) => {
      if (result && this.token) {
        console.log(result);
        this.accommodations.push(result);
      }
    });
  }

  public editAccommodation(accommodation: Accommodation): void {
    const dialogRef = this.dialog.open(AccommodationCreationDialogComponent, {
      width: '400px',
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
}
