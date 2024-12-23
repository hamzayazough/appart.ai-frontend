import { Component, OnInit } from '@angular/core';
import { RoommatePost } from '../../../../intefaces/roommate.interface';
import { RoommateService } from '../../../../services/roommate/roommate.service';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user-service/user.service';
import { AppUser, UserInfo } from '../../../../intefaces/user.interface';
import { UserPreferences } from '../../../../intefaces/user-preferences.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

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
  private userId: string = '';
  public userInfo: UserInfo | null = null;
  public userPreferences: UserPreferences | null = null;
  public userPreferencesKeys: { label: string; value: any }[] = [];
  public isEditMode: boolean = false;


  constructor(private roommateService: RoommateService, private userService: UserService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadUserPreferences();
    this.loadRoommateRequest();
  }

  onSubmit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to create or update a request.');
      return;
    }

    if (this.isEditMode && this.roommatePost.id) {
      this.roommateService.updateRoommateRequest(this.roommatePost.id, this.roommatePost as RoommatePost, token).subscribe(
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
      this.roommateService.addRoommateRequest(newPost, token).subscribe(
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
    const token = localStorage.getItem('token');
    if (!this.roommatePost.id || !token) {
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
          .updateRoommateRequestStatus(this.roommatePost.id, !this.roommatePost.active, token)
          .subscribe(
            () => {
              this.roommatePost.active = !this.roommatePost.active;
              alert(
                `Request has been ${
                  this.roommatePost.active ? 'activated' : 'deactivated'
                }.`
              );
            },
            (error) => {
              console.error('Error toggling request status:', error);
              alert('Failed to update request status. Please try again.');
            }
          );
      }
    });
  }
  
  

  private loadUserInfo(): void {
    const user: AppUser | null = this.userService.getStoredUser();
    if (!user) {
      console.error('User not found');
      return;
    }
    else {
      this.userId = user.id || '';
      this.userInfo = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phone: user.phone || '',
      };
    }
  }

  private loadRoommateRequest(): void {
    const token = localStorage.getItem('token');
    if (!this.userId || !token) {
      console.error('User ID or token not found.');
      return;
    }

    this.roommateService.getMyRoommateRequest(this.userId, token).subscribe(
      (response) => {
        if (response) {
          this.isEditMode = true;
          this.roommatePost = response;
          console.log(response);
          console.log('Roommate Request:', this.roommatePost.active);
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
    const user: AppUser | null = this.userService.getStoredUser();
    const token = localStorage.getItem('token');
    if (!user || !user.id || !token) {
      console.error('User not found');
      alert('User not found');
      return;
    }
    this.userService.getUserPreferences(user.id, token).subscribe(
      (preferences) => {
        if (preferences) {
          this.userPreferences = preferences;
          this.userPreferencesKeys = Object.entries(preferences).map(([key, value]) => ({
            label: this.formatKey(key),
            value: value
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
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }
}