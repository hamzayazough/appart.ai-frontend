import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoommatePost } from '../../../../intefaces/roommate.interface';
import { RoommateService } from '../../../../services/roommate/roommate.service';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user-service/user.service';
import { AppUser, UserInfo } from '../../../../intefaces/user.interface';
import { UserPreferences } from '../../../../intefaces/user-preferences.interface';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from '../../../../services/dialog-service/dialog.service';

@Component({
  selector: 'app-create-roommate-request',
  templateUrl: './create-roommate-request.component.html',
  styleUrl: './create-roommate-request.component.scss',
})
export class CreateRoommateRequestComponent implements OnInit, OnDestroy {
  public roommatePost: Partial<RoommatePost> = {
    description: '',
  };
  public currentDate: Date = new Date();
  private userId = '';
  public userInfo: UserInfo | null = null;
  public userPreferences: UserPreferences | null = null;
  public userPreferencesKeys: { label: string; value: any }[] = [];
  public isEditMode = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private roommateService: RoommateService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  decrementRoommates() {
    if (
      this.roommatePost.numberPreferredRoommates &&
      this.roommatePost.numberPreferredRoommates > 0
    ) {
      this.roommatePost.numberPreferredRoommates =
        (this.roommatePost.numberPreferredRoommates || 0) - 1;
    }
  }

  incrementRoommates() {
    this.roommatePost.numberPreferredRoommates =
      (this.roommatePost.numberPreferredRoommates || 0) + 1;
  }

  getUserInitials() {
    return this.userInfo
      ? `${this.userInfo.firstName.charAt(0)}${this.userInfo.lastName.charAt(0)}`
      : '';
  }

  onSubmit(): void {
    if (!this.validateRoommatePost()) {
      return;
    }

    if (this.isEditMode && this.roommatePost.id) {
      this.roommateService
        .updateRoommateRequest(this.roommatePost.id, this.roommatePost as RoommatePost)
        .subscribe({
          next: () => {
            this.dialogService.showSuccess(
              'Your roommate request has been updated successfully!',
              'Request Updated',
              'OK',
              true
            );
          },
          error: (error) => {
            console.error('Error updating roommate request:', error);
            this.dialogService.showError(
              'Failed to update roommate request. Please try again.',
              'Update Failed'
            );
          },
        });
    } else {
      const newPost: RoommatePost = {
        ...this.roommatePost,
        createdAt: new Date(),
        userId: this.userId,
      } as RoommatePost;

      this.roommateService.addRoommateRequest(newPost).subscribe({
        next: () => {
          this.dialogService.showSuccess(
            'Your roommate request has been created successfully!',
            'Request Created',
            'OK',
            true
          );
        },
        error: (error) => {
          console.error('Error creating roommate request:', error);
          this.dialogService.showError(
            'Failed to create roommate request. Please try again.',
            'Creation Failed'
          );
        },
      });
    }
  }

  public goToUserPreferencesPage(): void {
    this.router.navigate(['/account/:id/preferences']);
  }

  toggleRequestStatus(): void {
    if (!this.roommatePost.id) {
      this.dialogService.showWarning(
        'Unable to update status. Request ID is missing.',
        'Status Update Failed'
      );
      return;
    }

    this.dialogService
      .showConfirmation(
        `Are you sure you want to ${this.roommatePost.active ? 'deactivate' : 'activate'} this request?`,
        this.roommatePost.active ? 'Deactivate Request' : 'Activate Request',
        this.roommatePost.active ? 'Deactivate' : 'Activate',
        'Cancel'
      )
      .subscribe((confirmed) => {
        if (confirmed && this.roommatePost.id) {
          this.roommateService
            .updateRoommateRequestStatus(this.roommatePost.id, !this.roommatePost.active)
            .subscribe({
              next: () => {
                this.roommatePost.active = !this.roommatePost.active;
                this.dialogService.showSuccess(
                  `Your request has been ${this.roommatePost.active ? 'activated' : 'deactivated'} successfully.`,
                  'Status Updated',
                  'OK',
                  true
                );
              },
              error: (error) => {
                console.error('Error toggling request status:', error);
                this.dialogService.showError(
                  'Failed to update request status. Please try again.',
                  'Status Update Failed'
                );
              },
            });
        }
      });
  }

  private validateRoommatePost(): boolean {
    if (!this.roommatePost.description || this.roommatePost.description.trim() === '') {
      this.dialogService.showWarning(
        'Please provide a description for your roommate request.',
        'Missing Information'
      );
      return false;
    }

    if (this.roommatePost.numberPreferredRoommates === undefined) {
      this.dialogService.showWarning(
        'Please specify your preferred number of roommates.',
        'Missing Information'
      );
      return false;
    }

    return true;
  }

  private loadRoommateRequest(): void {
    if (!this.userId) {
      console.error('User not found');
      return;
    }

    this.roommateService.getMyRoommateRequest(this.userId).subscribe({
      next: (response) => {
        if (response) {
          this.isEditMode = true;
          this.roommatePost = response;
        } else {
          this.isEditMode = false;
          this.roommatePost = {
            description: '',
            numberPreferredRoommates: 1,
            active: true,
          };
        }
      },
      error: (error) => {
        console.error('Error loading roommate request:', error);
        this.dialogService.showError(
          'Failed to load your existing roommate request. Starting with a new request.',
          'Loading Error'
        );
        this.isEditMode = false;
      },
    });
  }

  private loadUserPreferences(): void {
    if (!this.userId) {
      console.error('User not found');
      return;
    }

    this.userService.getUserPreferences(this.userId).subscribe({
      next: (preferences) => {
        if (preferences) {
          this.userPreferences = preferences;
          this.userPreferencesKeys = Object.entries(preferences)
            .filter(([key]) => !['id', 'userId'].includes(key))
            .map(([key, value]) => ({
              label: this.formatKey(key),
              value: value,
            }));
        } else {
          console.warn('No preferences found for user.');
          this.userPreferences = null;
          this.userPreferencesKeys = [];

          this.dialogService
            .showWarning(
              "You haven't set your preferences yet. Setting your preferences will help others find you as a potential roommate.",
              'No Preferences Found',
              'Set Preferences Now',
              'Later'
            )
            .subscribe((setNow) => {
              if (setNow) {
                this.router.navigate([`/account/${this.userId}/preferences`]);
              }
            });
        }
      },
      error: (error) => {
        console.error('Error fetching user preferences:', error);
        this.dialogService.showError(
          'Failed to load your preferences. Some features may be limited.',
          'Preferences Error'
        );
      },
    });
  }

  private formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  private initializeData(): void {
    this.authService.loggedUser$.pipe(takeUntil(this.unsubscribe$)).subscribe((user) => {
      if (!user.id) {
        this.dialogService
          .showWarning(
            'You need to be logged in to create or manage roommate requests.',
            'Authentication Required'
          )
          .subscribe(() => {
            this.authService.handleUnAuthorizedUser();
          });
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
      this.dialogService
        .showWarning(
          'User information is incomplete. Please complete your profile.',
          'Incomplete Profile'
        )
        .subscribe(() => {
          this.router.navigate(['/register']);
        });
      return;
    }

    this.loadRoommateRequest();
    this.loadUserPreferences();
  }
}
