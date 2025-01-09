import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../services/user-service/user.service';
import { UserPreferences } from '../../../../../intefaces/user-preferences.interface';
import { AppUser } from '../../../../../intefaces/user.interface';
import { AbstractControl, FormControl } from '@angular/forms';
import { MapBoxService } from '../../../../../services/map-box-service/map-box.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Address } from '../../../../../intefaces/adress.interface';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../../dialogs/success-dialog/success-dialog.component';
import { AuthenticationService } from '../../../../../services/auth/authentication.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-account-preferences',
  templateUrl: './account-preferences.component.html',
  styleUrl: './account-preferences.component.scss'
})
export class AccountPreferencesComponent implements OnInit {
  public userPreferences: UserPreferences = {} as UserPreferences;
  public schoolAddressControl = new FormControl();
  public workAddressControl = new FormControl();
  public schoolAddressSuggestions: any[] = [];
  public workAddressSuggestions: any[] = [];
  public showSchoolSuggestions: boolean = false;
  public showWorkSuggestions: boolean = false;
  private user: AppUser = {} as AppUser;
  private unsubscribe$ = new Subject<void>();


  constructor(
    private userService: UserService,
    private mapboxService: MapBoxService,
    private dialog: MatDialog,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

    
  hideSchoolSuggestions() {
    setTimeout(() => {
      this.showSchoolSuggestions = false;
    }, 200);
  }

  hideWorkSuggestions() {
    setTimeout(() => {
      this.showWorkSuggestions = false;
    }, 200);
  }

  public selectAddress(suggestion: any, addressType: 'school' | 'work'): void {
    const address: Address = {
      placeName: suggestion.place_name,
      location: [suggestion.geometry.coordinates[0], suggestion.geometry.coordinates[1]],
    };

    if (addressType === 'school') {
      this.userPreferences.schoolAddress = address;
      this.schoolAddressControl.setValue(address.placeName);
      this.schoolAddressSuggestions = [];
    } else if (addressType === 'work') {
      this.userPreferences.workAddress = address;
      this.workAddressControl.setValue(address.placeName);
      this.workAddressSuggestions = [];
    }
  }

  private getUserPreferences(userId: string): void {
    this.userService.getUserPreferences(userId).subscribe(
      (preferences) => {
        if (preferences) {
          this.userPreferences = preferences;
          this.schoolAddressControl.setValue(preferences.schoolAddress?.placeName || '');
          this.workAddressControl.setValue(preferences.workAddress?.placeName || '');
          this.initializeAddressControls();
        } else {
          console.warn('No preferences found for the user.');
          alert('No preferences found. Please create new preferences.');
        }
      },
      (error) => {
        if (error.status === 404) {
          alert('User preferences not found. Please create preferences.');
        } else {
          console.error('Error fetching user preferences:', error);
        }
      }
    );
  }

  public updatePreferences(): void {
    if (!this.user.id) {
      alert('User ID or token is missing.');
      return;
    }

    this.userService.updateUserPreferences(this.user.id, this.userPreferences).subscribe(
      () => this.showSuccessDialog(),
      (error) => {
        console.error('Error updating preferences:', error);
      }
    );
  }

  public setPreferences(): void {
    if (!this.user.id) {
      alert('User ID or token is missing.');
      return;
    }

    this.userService.createUserPreferences(this.userPreferences, this.user.id).subscribe(
      (data: UserPreferences) => {
        this.userPreferences = data;
        this.showSuccessDialog();
      },
      (error) => {
        console.error('Error creating preferences:', error);
      }
    );
  }

  private showSuccessDialog(): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent);
    setTimeout(() => dialogRef.close(), 3000);
  }

  private initializeData(): void {
    this.authService.loggedUser$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((user) => {
      if (!user.id) {
        this.authService.handleUnAuthorizedUser();
      } else {
        this.user = user;
        this.subscribeToLoggedUser();
      }
    });
  }

  private subscribeToLoggedUser(): void {
    this.authService.loggedUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user: AppUser) => {
        this.user = user;
        if (!this.user || !this.user.id) {
          alert('Please log in to access this page.');
          this.authService.handleUnAuthorizedUser();
          return;
        }
        this.getUserPreferences(this.user.id);
      });
  }

  private initializeAddressControls(): void {
    this.setupAddressControl(this.schoolAddressControl, 'school');
    this.setupAddressControl(this.workAddressControl, 'work');
  }
  
  private setupAddressControl(control: AbstractControl, type: 'school' | 'work'): void {
    control.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => this.handleAddressInput(value, type));
  }

  private handleAddressInput(value: string, type: 'school' | 'work'): void {
    if (!value) {
      if (type === 'school') this.schoolAddressSuggestions = [];
      if (type === 'work') this.workAddressSuggestions = [];
      return;
    }

    this.mapboxService.searchPlace(value).subscribe((response: any) => {
      if (type === 'school') {
        this.schoolAddressSuggestions = response.features;
      } else if (type === 'work') {
        this.workAddressSuggestions = response.features;
      }
    });
  }


}