import { Component, OnInit } from '@angular/core';
import { RoommatePostInfo } from '../../../../intefaces/roommate.interface';
import { RoommateService } from '../../../../services/roommate/roommate.service';
import { UserService } from '../../../../services/user-service/user.service';

@Component({
  selector: 'app-roommate-searching',
  templateUrl: './roommate-searching.component.html',
  styleUrl: './roommate-searching.component.scss'
})
export class RoommateSearchingComponent implements OnInit {
  public roommatePosts: RoommatePostInfo[] = [];
  public currentPostIndex: number = 0;

  constructor(private roommateService: RoommateService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadRoommateRequests();
  }

  get currentPost(): RoommatePostInfo | null {
    return this.roommatePosts[this.currentPostIndex] || null;
  }

  public loadRoommateRequests(): void {
    const token = localStorage.getItem('token');
    const userId = this.userService.getStoredUser()?.id;

    if (!token || !userId) {
      alert('You need to be logged in to do this.');
      return;
    }

    this.roommateService.getPosts(userId, token).subscribe(
      (posts) => {
        this.roommatePosts = posts;
        console.log('Loaded posts:', posts);
      },
      (error) => {
        console.error('Error loading posts:', error);
        alert('Failed to load posts.');
      }
    );
  }

  public swipe(action: 'like' | 'dislike'): void {
    const token = localStorage.getItem('token');
    const userId = this.userService.getStoredUser()?.id;
    const postId = this.currentPost?.roommatePost.id;

    if (!token || !userId || !postId) {
      alert('Unable to perform action.');
      return;
    }

    this.roommateService.swipe(userId, postId, action, token).subscribe(
      () => {
        alert(`You ${action}d the post.`);
        this.currentPostIndex++;
      },
      (error) => {
        console.error('Error swiping:', error);
        alert('Failed to perform action.');
      }
    );
  }

  get preferenceKeys() {
    return Object.entries(this.currentPost?.userPreferences || {}).map(([key, value]) => ({
      label: this.formatKey(key),
      value,
    }));
  }

  private formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }
}