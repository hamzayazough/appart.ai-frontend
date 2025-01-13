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
import { Place } from '../../../../../intefaces/place.interface';

@Component({
  selector: 'app-account-preferences',
  templateUrl: './account-preferences.component.html',
  styleUrl: './account-preferences.component.scss'
})
export class AccountPreferencesComponent implements OnInit {
  public userPreferences: UserPreferences = {} as UserPreferences;
  public placeControls: FormControl[] = [];
  public placeSuggestions: any[][] = [];
  public showSuggestions: boolean[] = [];
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

  public addPlace(): void {
    const newPlace: Place = {
      id: '',
      name: '',
      address: { placeName: '', location: [0, 0] },
      weight: 0,
    };
    this.userPreferences.places.push(newPlace);
    const index = this.userPreferences.places.length - 1;
    this.placeControls[index] = new FormControl();
    this.placeSuggestions[index] = [];
    this.showSuggestions[index] = false;
  
    this.setupAddressControl(this.placeControls[index], index);
  }
  

  public removePlace(index: number): void {
    this.userPreferences.places.splice(index, 1);
    this.placeControls.splice(index, 1);
    this.placeSuggestions.splice(index, 1);
    this.showSuggestions.splice(index, 1);
  }

  public selectAddress(suggestion: any, index: number): void {
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

  
  private setupAddressControl(control: AbstractControl, index: number): void {
    control.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      if (!value) {
        this.placeSuggestions[index] = [];
        return;
      }
      this.mapboxService.searchPlace(value).subscribe((response: any) => {
        this.placeSuggestions[index] = response.features;
      });
    });
  }

  private getUserPreferences(userId: string): void {
    this.userService.getUserPreferences(userId).subscribe(
      (preferences) => {
        if (preferences) {
          this.userPreferences = preferences;
          console.log('User preferences:', this.userPreferences);
          this.initializePlaces(preferences.places);
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

  private initializePlaces(places: Place[]): void {
    this.placeControls = [];
    this.placeSuggestions = [];
    this.showSuggestions = [];
  
    places.forEach((place, index) => {
      this.placeControls[index] = new FormControl(place.address.placeName || '');
      this.placeSuggestions[index] = [];
      this.showSuggestions[index] = false;
      this.setupAddressControl(this.placeControls[index], index);
    });
  }  


}