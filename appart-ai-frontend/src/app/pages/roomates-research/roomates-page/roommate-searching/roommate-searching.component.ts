import { Component, OnInit } from '@angular/core';
import { RoommatePostInfo } from '../../../../intefaces/roommate.interface';
import { RoommateService } from '../../../../services/roommate/roommate.service';
import { UserService } from '../../../../services/user-service/user.service';
import { AuthenticationService } from '../../../../services/auth/authentication.service';

@Component({
  selector: 'app-roommate-searching',
  templateUrl: './roommate-searching.component.html',
  styleUrl: './roommate-searching.component.scss'
})
export class RoommateSearchingComponent implements OnInit {
  public roommatePosts: RoommatePostInfo[] = [];
  public currentPostIndex: number = 0;
  private userId: string = "";

  constructor(private roommateService: RoommateService, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.getUserId();
    this.loadRoommateRequests();
  }

  get currentPost(): RoommatePostInfo | null {
    return this.roommatePosts[this.currentPostIndex] || null;
  }

  public loadRoommateRequests(): void {
    this.roommateService.getPosts(this.userId).subscribe({
      next: (posts) => {
        this.roommatePosts = posts;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        alert('Failed to load posts.');
      },
    });
  }

  public swipe(action: 'like' | 'dislike'): void {
    const postId = this.currentPost?.roommatePost.id;

    if (!postId || !this.userId) {
      alert('Unable to perform action.');
      return;
    }
    this.roommateService.swipe(this.userId, postId, action).subscribe({
      next: () => {
        alert(`You ${action}d the post.`);
        this.currentPostIndex++;
      },
      error: (err) => {
        console.error('Error swiping:', err);
        alert('Failed to perform action.');
      },
    });
  }

  get preferenceKeys() {
    return Object.entries(this.currentPost?.userPreferences || {}).map(
      ([key, value]) => ({
        label: this.formatKey(key),
        value,
      })
    );
  }

  private formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }


  private getUserId(): void {
    this.authService.loggedUser.subscribe((user) => {
      if (user.id) {
        this.userId = user.id;
        return;
      }
      alert('User ID is not defined. Please log in again.');
    });
  }
  
}