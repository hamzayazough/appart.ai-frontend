import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../services/user-service/user.service';
import { UserPreferences } from '../../../../../intefaces/user-preferences.interface';
import { AppUser } from '../../../../../intefaces/user.interface';
import { FormControl } from '@angular/forms';
import { MapBoxService } from '../../../../../services/map-box-service/map-box.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Address } from '../../../../../intefaces/adress.interface';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../../dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-account-preferences',
  templateUrl: './account-preferences.component.html',
  styleUrl: './account-preferences.component.scss'
})
export class AccountPreferencesComponent implements OnInit {
  public userPreferences: UserPreferences = {} as UserPreferences;
  public schoolAddressControl = new FormControl();
  public workAddressControl = new FormControl();
  schoolAddressSuggestions: any[] = [];
  workAddressSuggestions: any[] = [];
  public showSchoolSuggestions: boolean = false;
  public showWorkSuggestions: boolean = false;
  private token: string = '';
  private  userId: string | null = null;

  constructor(private userService: UserService, private mapboxService: MapBoxService, private dialog: MatDialog) {
  }


  ngOnInit() {
    this.getUser();
    this.getUserPreferences();
    this.schoolAddressControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value) {
          this.mapboxService.searchPlace(value).subscribe((response: any) => {
            this.schoolAddressSuggestions = response.features;
            console.log(this.schoolAddressControl);
          });
        } else {
          this.schoolAddressSuggestions = [];
        }
      });

    this.workAddressControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value) {
          this.mapboxService.searchPlace(value).subscribe((response: any) => {
            this.workAddressSuggestions = response.features;
          });
        } else {
          this.workAddressSuggestions = [];
        }
      });
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

  public selectAddress(suggestion: any, addressType: 'school' | 'work') {
    const address: Address = {
      placeName: suggestion.place_name,
      location: [suggestion.geometry.coordinates[0], suggestion.geometry.coordinates[1]]
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
  

  private getUserPreferences(): void {
    if (!this.userId || !this.token) {
      return;
    }
    this.userService.getUserPreferences(this.userId, this.token).subscribe(
      (data: UserPreferences) => {
        if (data) {
          this.userPreferences = data;
          if (this.userPreferences.schoolAddress) {
            this.schoolAddressControl.setValue(this.userPreferences.schoolAddress.placeName);
          }
        
          if (this.userPreferences.workAddress) {
            this.workAddressControl.setValue(this.userPreferences.workAddress.placeName);
          }

        } else {
          alert('No preferences found for this user. Please create new preferences.');
        }
      },
      (error) => {
        if (error.status === 404) {
          alert('User preferences not found. Please create preferences.');
        } else {
          console.error('Error fetching user preferences:', error);
          alert('An error occurred while fetching user preferences.');
        }
      }
    );
  }
  

  public updatePreferences(): void {
    if (!this.userId || !this.token) {
      return;
    }
    this.userService.updateUserPreferences(this.userId, this.userPreferences, this.token).subscribe(
      (data: UserPreferences) => {
        this.showSuccessDialog();
      },
      (error) => {
        console.error('Error updating preferences', error);
      }
    );
  }

  public setPreferences(): void {
    if (!this.userId || !this.token) {
      return;
    }
      
  
    this.userService.createUserPreferences(this.userPreferences, this.userId, this.token).subscribe(
      (data: UserPreferences) => {
        this.userPreferences = data;
        this.showSuccessDialog();
      },
      (error) => {
        console.error('Error creating preferences', error);
      }
    );
  }
  private getUser(): void {
    const token: string | null = localStorage.getItem('token');
    const storedUser: AppUser | null = this.userService.getStoredUser();
    if (!token || !storedUser) {
      alert("Attention, veuillez vous identifier pour accéder à cette page!");
      return;
    }
    this.token = token;
    this.userId = storedUser.id ?? '';
  }

  private showSuccessDialog(): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent);

    setTimeout(() => {
      dialogRef.close();
    }, 3000);
  }
}