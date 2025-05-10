import { Component, OnInit } from '@angular/core';
import { RoommatePost } from '../../../../intefaces/roommate.interface';
import { RoommateService } from '../../../../services/roommate/roommate.service';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user-service/user.service';
import { AppUser, UserInfo } from '../../../../intefaces/user.interface';
import { UserPreferences } from '../../../../intefaces/user-preferences.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-roommate-request',
  templateUrl: './create-roommate-request.component.html',
  styleUrl: './create-roommate-request.component.scss',
})
export class CreateRoommateRequestComponent implements OnInit {
  public roommatePost: Partial<RoommatePost> = {
    description: '',
  };
  public currentDate: Date = new Date();
  private userId = '';
  public userInfo: UserInfo | null = null;
  public userPreferences: UserPreferences | null = null;
  public userPreferencesKeys: { label: string; value }[] = [];
  public isEditMode = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private roommateService: RoommateService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  decrementRoommates() {
    if (this.roommatePost.roommates && this.roommatePost.roommates > 0) {
      this.roommatePost.roommates = (this.roommatePost.roommates || 0) - 1;
    }
  }

  incrementRoommates() {
    this.roommatePost.roommates = (this.roommatePost.roommates || 0) + 1;
  }

  getUserInitials() {
    return this.userInfo
      ? `${this.userInfo.firstName.charAt(0)}${this.userInfo.lastName.charAt(0)}`
      : '';
  }

  onSubmit(): void {
    if (this.isEditMode && this.roommatePost.id) {
      this.roommateService
        .updateRoommateRequest(this.roommatePost.id, this.roommatePost as RoommatePost)
        .subscribe(
          () => {
            alert('Roommate Request Updated Successfully!');
          },
          (error) => {
            console.error('Error updating roommate request:', error);
            alert('Failed to update roommate request. Please try again.');
          }
        );
    } else {
      const newPost: RoommatePost = {
        ...this.roommatePost,
        createdAt: new Date(),
        userId: this.userId,
      } as RoommatePost;
      this.roommateService.addRoommateRequest(newPost).subscribe(
        () => {
          alert('Roommate Request Created Successfully!');
        },
        (error) => {
          console.error('Error creating roommate request:', error);
          alert('Failed to create roommate request. Please try again.');
        }
      );
    }
  }

  public goToUserPreferencesPage(): void {
    this.router.navigate(['/account/:id/preferences']);
  }

  toggleRequestStatus(): void {
    if (!this.roommatePost.id) {
      alert('Unable to update status. Please try again.');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      data: {
        title: this.roommatePost.active ? 'Deactivate Request' : 'Activate Request',
        message: `Are you sure you want to ${
          this.roommatePost.active ? 'deactivate' : 'activate'
        } this request?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed && this.roommatePost.id) {
        this.roommateService
          .updateRoommateRequestStatus(this.roommatePost.id, !this.roommatePost.active)
          .subscribe(
            () => {
              this.roommatePost.active = !this.roommatePost.active;
              alert(`Request has been ${this.roommatePost.active ? 'activated' : 'deactivated'}.`);
            },
            (error) => {
              console.error('Error toggling request status:', error);
              alert('Failed to update request status. Please try again.');
            }
          );
      }
    });
  }

  private loadRoommateRequest(): void {
    if (!this.userId) {
      console.error('User not found');
      return;
    }
    this.roommateService.getMyRoommateRequest(this.userId).subscribe(
      (response) => {
        if (response) {
          this.isEditMode = true;
          this.roommatePost = response;
        } else {
          this.isEditMode = false;
        }
      },
      (error) => {
        console.error('Error loading roommate request:', error);
      }
    );
  }

  private loadUserPreferences(): void {
    if (!this.userId) {
      console.error('User not found');
      return;
    }
    this.userService.getUserPreferences(this.userId).subscribe(
      (preferences) => {
        if (preferences) {
          this.userPreferences = preferences;
          this.userPreferencesKeys = Object.entries(preferences).map(([key, value]) => ({
            label: this.formatKey(key),
            value: value,
          }));
        } else {
          console.warn('No preferences found for user.');
          this.userPreferences = null;
          this.userPreferencesKeys = [];
        }
      },
      (error) => {
        console.error('Error fetching user preferences:', error);
      }
    );
  }

  private formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  private initializeData(): void {
    this.authService.loggedUser$.pipe(takeUntil(this.unsubscribe$)).subscribe((user) => {
      if (!user.id) {
        this.authService.handleUnAuthorizedUser();
      } else {
        this.setUserData(user);
      }
    });
  }

  private setUserData(user: AppUser): void {
    this.userId = user.id || '';
    this.userInfo = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      phone: user.phone || '',
    };

    if (!this.userId) {
      this.router.navigate(['/register']);
      return;
    }
    this.loadRoommateRequest();
    this.loadUserPreferences();
  }
}
