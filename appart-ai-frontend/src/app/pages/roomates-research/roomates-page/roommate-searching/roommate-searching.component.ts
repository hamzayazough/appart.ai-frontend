import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoommatePostInfo } from '../../../../intefaces/roommate.interface';
import { RoommateService } from '../../../../services/roommate/roommate.service';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-roommate-searching',
  templateUrl: './roommate-searching.component.html',
  styleUrl: './roommate-searching.component.scss'
})
export class RoommateSearchingComponent implements OnInit, OnDestroy {
  public roommatePosts: RoommatePostInfo[] = [];
  public currentPostIndex: number = 0;
  private userId: string = "";
  private unsubscribe$ = new Subject<void>();

  constructor(private roommateService: RoommateService, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get currentPost(): RoommatePostInfo | null {
    return this.roommatePosts[this.currentPostIndex] || null;
  }

  get preferenceKeys() {
    return Object.entries(this.currentPost?.userPreferences || {}).map(
      ([key, value]) => ({
        label: this.formatKey(key),
        value,
      })
    );
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

  private formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }


  private initializeData(): void {
    this.authService.loggedUser$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((user) => {
      if (!user.id) {
        this.authService.handleUnAuthorizedUser();
      } else {
        this.userId = user.id;
        this.loadRoommateRequests();
      }
    });
  }
  

}