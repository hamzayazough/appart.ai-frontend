import { Component } from '@angular/core';
import { UserService } from '../../../services/user-service/user.service';
import { AppUser, UserInfo } from '../../../intefaces/user.interface';
import { Router } from '@angular/router';
import { SelectedHeader } from '../../../enums/selected-header.enum';
import { UserType } from '../../../enums/user-type.enum';

enum Display {
  Contact = "My Contact",
  Hobbies = "My Hobbies",
  MySavedAccommodations = "My saved accommodations",
  AccommodationManagement = "Accommodations management (landlord feature)"
}

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss'
})


export class AccountPageComponent {
  public user: AppUser = {} as AppUser;
  public userType = UserType;
  private token: string = '';
  public display = Display;
  public selectedHeader = SelectedHeader.myProfile;
  public selectedSection: string | null = null;


  constructor(private userService: UserService, private router: Router) {
    this.getUser();
  }


  private getUser(): void {
    const token: string | null = localStorage.getItem('token');
    const storedUser: AppUser | null = this.userService.getStoredUser();
    if (!token || !storedUser) {
      alert("Attention, veuillez vous identifier pour accéder à cette page!");
      return;
    }
    this.token = token;
    this.user = storedUser;
  }

  public updateUserInfo(): void {
    const userInfo: UserInfo = {
      username: this.user.username,
      phone: this.user.phone || '',
      firstName: this.user.firstName,
      lastName: this.user.lastName
    };
    if (!this.validateFields(userInfo)) {
      alert("Please make sure all fields are filled out.");
      return;
    }

    if (!this.validatePhoneNumber(userInfo.phone)) {
      alert("Please enter a valid phone number in the format: 5813378450");
      return;
    }
    const userId = this.user.id;
    if(!userId) return;
    this.userService.validateNewUserName(userId, userInfo.username, this.token).subscribe(
      (isValid: boolean) => {
        if (isValid) {
          this.changeUserInfo(userInfo);
          return;
        }
        alert("This UserName is invalid");
      },
      (error: Error) => {
        alert(`There was a problem. We couldn't update your informations, ${error.message}`);
      }
    );
    
  }

  public toggleSection(section: Display): void {
    const routes = {
      [this.display.Contact]: 'contacts',
      [this.display.Hobbies]: 'hobbies',
      [this.display.MySavedAccommodations]: 'saved-accommodations',
      [this.display.AccommodationManagement]: 'accommodations-manager'
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
  
  private changeUserInfo(userInfo: UserInfo) {
    this.userService.changeUserInfo(this.user.id || '', userInfo, this.token).subscribe(
      (updatedUser: AppUser) => {
        alert('Informations mises à jour avec succès !');
        this.user = updatedUser;
        localStorage.setItem("user", JSON.stringify(updatedUser));
      },
      (error) => {
        console.error('Erreur lors de la mise à jour des informations:', error);
      }
    );
  }
}

