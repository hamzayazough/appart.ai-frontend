import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../../../services/user-service/user.service';
import { UserPreferences } from '../../../../../intefaces/user-preferences.interface';
import { AppUser } from '../../../../../intefaces/user.interface';
import { AbstractControl, FormControl } from '@angular/forms';
import { MapBoxService } from '../../../../../services/map-box-service/map-box.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Address } from '../../../../../intefaces/adress.interface';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../../../../services/auth/authentication.service';
import { Subject } from 'rxjs';
import { Place } from '../../../../../intefaces/place.interface';
import { DialogService } from '../../../../../services/dialog-service/dialog.service';

@Component({
  selector: 'app-account-preferences',
  templateUrl: './account-preferences.component.html',
  styleUrl: './account-preferences.component.scss',
})
export class AccountPreferencesComponent implements OnInit, OnDestroy {
  public userPreferences: UserPreferences = this.initializeEmptyPreferences();
  public currentYear = new Date().getFullYear();
  public placeControls: FormControl[] = [];
  public placeSuggestions: any[][] = [];
  public showSuggestions: boolean[] = [];
  public isExistingPreferences = false;
  private user: AppUser = {} as AppUser;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private mapboxService: MapBoxService,
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

  private initializeEmptyPreferences(): UserPreferences {
    return {
      occupation: '',
      pets: false,
      minBudget: 0,
      maxBudget: 0,
      car: false,
      numBedroomMin: 1,
      numBathroomMin: 1,
      minAvailableDate: new Date(),
      maxAvailableDate: new Date(),
      airConditioning: false,
      furnished: false,
      utilitiesIncluded: false,
      dishwasher: false,
      stainlessSteelAppliances: false,
      patio: false,
      balcony: false,
      refrigerator: false,
      petsAllowed: false,
      smokingAllowed: false,
      gymIncluded: false,
      publicTransportationProximity: 5,
      parking: 5,
      groceryStoreProximity: 5,
      places: [],
      pool: false,
      elevator: false,
      garage: false,
      minimalConstructionDate: 0,
      minimalLandArea: 0,
    };
  }

  public addPlace(): void {
    if (!this.userPreferences.places) {
      this.userPreferences.places = [];
    }

    const newPlace: Place = {
      id: '',
      name: '',
      address: { placeName: '', location: [0, 0] },
      weight: 5,
    };

    this.userPreferences.places.push(newPlace);
    const index = this.userPreferences.places.length - 1;
    this.placeControls[index] = new FormControl();
    this.placeSuggestions[index] = [];
    this.showSuggestions[index] = false;

    this.setupAddressControl(this.placeControls[index], index);
  }

  public removePlace(index: number): void {
    if (!this.userPreferences.places) {
      return;
    }

    this.userPreferences.places.splice(index, 1);
    this.placeControls.splice(index, 1);
    this.placeSuggestions.splice(index, 1);
    this.showSuggestions.splice(index, 1);
  }

  public selectAddress(suggestion: any, index: number): void {
    if (!this.userPreferences.places || !this.userPreferences.places[index]) {
      return;
    }

    const address: Address = {
      placeName: suggestion.place_name,
      location: [suggestion.geometry.coordinates[0], suggestion.geometry.coordinates[1]],
    };

    this.userPreferences.places[index].address = address;
    this.placeControls[index].setValue(address.placeName);
    this.placeSuggestions[index] = [];
    this.showSuggestions[index] = false;
  }

  public hideSuggestions(index: number): void {
    setTimeout(() => {
      this.showSuggestions[index] = false;
    }, 200);
  }

  public updatePreferences(): void {
    if (!this.user.id) {
      this.dialogService.showError('User ID or token is missing.', 'Authentication Error');
      return;
    }

    if (!this.validatePreferences()) {
      return;
    }

    this.userService.updateUserPreferences(this.user.id, this.userPreferences).subscribe({
      next: () => this.showSuccessDialog('Preferences updated successfully!'),
      error: (error) => {
        console.error('Error updating preferences:', error);
        this.dialogService.showError(
          'Failed to update preferences. Please try again.',
          'Update Error'
        );
      },
    });
  }

  public setPreferences(): void {
    if (!this.user.id) {
      this.dialogService.showError('User ID or token is missing.', 'Authentication Error');
      return;
    }

    if (!this.validatePreferences()) {
      return;
    }

    this.userService.createUserPreferences(this.userPreferences, this.user.id).subscribe({
      next: (data: UserPreferences) => {
        this.userPreferences = data;
        this.isExistingPreferences = true;
        this.showSuccessDialog('Preferences created successfully!');
      },
      error: (error) => {
        console.error('Error creating preferences:', error);
        this.dialogService.showError(
          'Failed to create preferences. Please try again.',
          'Creation Error'
        );
      },
    });
  }

  private validatePreferences(): boolean {
    if (this.userPreferences.minBudget > this.userPreferences.maxBudget) {
      this.dialogService.showWarning(
        'Minimum budget cannot be greater than maximum budget.',
        'Validation Error'
      );
      return false;
    }

    if (this.userPreferences.minAvailableDate && this.userPreferences.maxAvailableDate) {
      const minDate = new Date(this.userPreferences.minAvailableDate);
      const maxDate = new Date(this.userPreferences.maxAvailableDate);

      if (minDate > maxDate) {
        this.dialogService.showWarning(
          'Earliest move-in date cannot be after latest move-in date.',
          'Validation Error'
        );
        return false;
      }
    }

    if (this.userPreferences.places && this.userPreferences.places.length > 0) {
      for (let i = 0; i < this.userPreferences.places.length; i++) {
        const place = this.userPreferences.places[i];
        if (!place.name || place.name.trim() === '') {
          this.dialogService.showWarning(`Place #${i + 1} is missing a name.`, 'Validation Error');
          return false;
        }

        if (!place.address || !place.address.placeName || place.address.placeName.trim() === '') {
          this.dialogService.showWarning(
            `Place #${i + 1} is missing an address.`,
            'Validation Error'
          );
          return false;
        }
      }
    }

    return true;
  }

  private showSuccessDialog(message: string): void {
    this.dialogService.showSuccess(message, 'Success', 'OK', true);
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
        this.subscribeToLoggedUser();
      }
    });
  }

  private subscribeToLoggedUser(): void {
    this.authService.loggedUser$.pipe(takeUntil(this.unsubscribe$)).subscribe((user: AppUser) => {
      this.user = user;
      if (!this.user || !this.user.id) {
        this.dialogService
          .showWarning('Please log in to access this page.', 'Authentication Required')
          .subscribe(() => {
            this.authService.handleUnAuthorizedUser();
          });
        return;
      }
      this.getUserPreferences(this.user.id);
    });
  }

  private setupAddressControl(control: AbstractControl, index: number): void {
    control.valueChanges
      .pipe(takeUntil(this.unsubscribe$), debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (!value) {
          this.placeSuggestions[index] = [];
          return;
        }
        this.mapboxService.searchPlace(value).subscribe({
          next: (response: any) => {
            this.placeSuggestions[index] = response.features;
            this.showSuggestions[index] = this.placeSuggestions[index].length > 0;
          },
          error: (error) => {
            console.error('Error searching for place:', error);
          },
        });
      });
  }

  private getUserPreferences(userId: string): void {
    this.userService.getUserPreferences(userId).subscribe({
      next: (preferences) => {
        if (preferences) {
          this.isExistingPreferences = true;
          this.userPreferences = { ...this.initializeEmptyPreferences(), ...preferences };

          if (!this.userPreferences.places) {
            this.userPreferences.places = [];
          }

          this.initializePlaces(this.userPreferences.places);
        } else {
          this.isExistingPreferences = false;
          console.warn('No preferences found for the user.');
          this.dialogService.showInfo(
            'No preferences found. Please create new preferences.',
            'Preferences Not Found'
          );
          this.userPreferences = this.initializeEmptyPreferences();
        }
      },
      error: (error) => {
        if (error.status === 404) {
          this.isExistingPreferences = false;
          this.dialogService.showInfo(
            'User preferences not found. Please create preferences.',
            'Preferences Not Found'
          );
          this.userPreferences = this.initializeEmptyPreferences();
        } else {
          console.error('Error fetching user preferences:', error);
          this.dialogService.showError('Failed to fetch preferences. Please try again.', 'Error');
        }
      },
    });
  }

  private initializePlaces(places: Place[]): void {
    this.placeControls = [];
    this.placeSuggestions = [];
    this.showSuggestions = [];

    if (!places || places.length === 0) {
      return;
    }

    places.forEach((place, index) => {
      if (!place.address) {
        place.address = { placeName: '', location: [0, 0] };
      }

      this.placeControls[index] = new FormControl(place.address.placeName || '');
      this.placeSuggestions[index] = [];
      this.showSuggestions[index] = false;
      this.setupAddressControl(this.placeControls[index], index);
    });
  }
}
