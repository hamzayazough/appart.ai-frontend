import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user-service/user.service';
import { AppUser, UserInfo } from '../../../intefaces/user.interface';
import { Router } from '@angular/router';
import { SelectedHeader } from '../../../enums/selected-header.enum';
import { UserType } from '../../../enums/user-type.enum';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from '../../../services/dialog-service/dialog.service';

enum Display {
  Contact = 'My Contact',
  Preferences = 'My Preferences',
  MySavedAccommodations = 'My saved accommodations',
  AccommodationManagement = 'Accommodations management (landlord feature)',
}

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
})
export class AccountPageComponent implements OnInit, OnDestroy {
  public user: AppUser = {} as AppUser;
  public userType = UserType;
  public display = Display;
  public selectedHeader = SelectedHeader.myProfile;
  public selectedSection: string | null = null;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private router: Router,
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

  public updateUserInfo(): void {
    const userInfo: UserInfo = {
      username: this.user.username,
      phone: this.user.phone || '',
      firstName: this.user.firstName,
      lastName: this.user.lastName,
    };

    if (!this.validateFields(userInfo)) {
      this.dialogService.showWarning(
        'Please make sure all fields are filled out.',
        'Validation Error'
      );
      return;
    }

    if (!this.validatePhoneNumber(userInfo.phone)) {
      this.dialogService.showWarning(
        'Please enter a valid phone number in the format: 5813378450',
        'Invalid Phone Number'
      );
      return;
    }

    const userId = this.user.id;
    if (!userId) {
      this.dialogService.showError(
        'User ID is missing. Please try again or log in again.',
        'User Error'
      );
      return;
    }

    this.userService.validateNewUserName(userId, userInfo.username).subscribe({
      next: (isValid: boolean) => {
        if (isValid) {
          this.changeUserInfo(userInfo);
          return;
        }
        this.dialogService.showWarning(
          'This username is already taken or invalid. Please choose a different username.',
          'Invalid Username'
        );
      },
      error: (error: Error) => {
        this.dialogService.showError(
          `There was a problem. We couldn't update your information: ${error.message}`,
          'Update Failed'
        );
      },
    });
  }

  public toggleSection(section: Display): void {
    const routes = {
      [this.display.Contact]: 'contacts',
      [this.display.Preferences]: 'preferences',
      [this.display.MySavedAccommodations]: 'saved-accommodations',
      [this.display.AccommodationManagement]: 'accommodations-manager',
    };

    const route = routes[section];
    if (route) {
      this.router.navigate([`/account/${this.user.id}/${route}`]);
    }
  }

  private validateFields(userInfo: UserInfo): boolean {
    const noSpacesRegex = /^\S+$/;
    return (
      noSpacesRegex.test(userInfo.username) &&
      noSpacesRegex.test(userInfo.firstName) &&
      noSpacesRegex.test(userInfo.lastName) &&
      userInfo.phone.trim() !== ''
    );
  }

  private validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  }

  private changeUserInfo(userInfo: UserInfo): void {
    this.userService.changeUserInfo(this.user.id || '', userInfo).subscribe({
      next: (updatedUser: AppUser) => {
        this.dialogService.showSuccess(
          'Information updated successfully!',
          'Update Successful',
          'OK',
          true
        );
        this.user = updatedUser;
        this.authService.updateLoggedUserInfo(updatedUser);
      },
      error: (error) => {
        console.error('Error updating information:', error);
        this.dialogService.showError(
          'Failed to update your information. Please try again.',
          'Update Error'
        );
      },
    });
  }

  private initializeData(): void {
    this.authService.loggedUser$.pipe(takeUntil(this.unsubscribe$)).subscribe((user) => {
      if (!user.id) {
        this.dialogService
          .showWarning('You need to be logged in to access this page.', 'Authentication Required')
          .subscribe(() => {
            this.authService.handleUnAuthorizedUser();
          });
      } else {
        this.user = user;
      }
    });
  }
}
