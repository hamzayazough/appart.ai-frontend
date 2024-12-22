import { Component, OnInit } from '@angular/core';
import { RoommatePost } from '../../../../intefaces/roommate.interface';
import { RoommateService } from '../../../../services/roommate/roommate.service';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user-service/user.service';
import { AppUser, UserInfo } from '../../../../intefaces/user.interface';
import { UserPreferences } from '../../../../intefaces/user-preferences.interface';

@Component({
  selector: 'app-create-roommate-request',
  templateUrl: './create-roommate-request.component.html',
  styleUrl: './create-roommate-request.component.scss'
})
export class CreateRoommateRequestComponent implements OnInit {
  public roommatePost: Partial<RoommatePost> = {
    description: ''
  };
  public currentDate: Date = new Date();
  public userInfo: UserInfo | null = null; // Ajout de userInfo
  public userPreferences: UserPreferences | null = null; // Ajout de userPreferences

  constructor(private roommateService: RoommateService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Récupérer les informations de l'utilisateur et les préférences
    this.loadUserInfo();
    this.loadUserPreferences();
  }

  onSubmit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to create a request.');
      return;
    }

    const newPost: RoommatePost = {
      ...this.roommatePost,
      createdAt: new Date(),
      userId: 'current-user-id' // Remplacez par l'ID utilisateur réel
    } as RoommatePost;

    this.roommateService.addRoommateRequest(newPost, token).subscribe(
      (response) => {
        alert('Roommate Request Created Successfully!');
        this.router.navigate(['/r']);
      },
      (error) => {
        console.error('Error creating roommate request:', error);
        alert('Failed to create roommate request. Please try again.');
      }
    );
  }

  public goToUserPreferencesPage(): void {
    this.router.navigate(['/account/:id/preferences']);
  }

  private loadUserInfo(): void {
    // Appeler un service pour récupérer les informations de l'utilisateur
    const user: AppUser | null = this.userService.getStoredUser();
    if (!user) {
      console.error('User not found');
      return;
    }
    else {
      this.userInfo = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phone: user.phone || '',
      };
    }
  }

  private loadUserPreferences(): void {
    const user: AppUser | null = this.userService.getStoredUser();
    const token = localStorage.getItem('token');
    if (!user || !user.id || !token) {
      console.error('User not found');
      alert('User not found');
      return;
    }
    this.userService.getUserPreferences(user.id, token).subscribe(
      (preferences) => {
        this.userPreferences = preferences;
      },
      (error) => {
        console.error('Error fetching user preferences:', error);
      }
    );
  }
}