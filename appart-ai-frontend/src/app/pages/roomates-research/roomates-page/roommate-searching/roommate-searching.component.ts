import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoommatePostInfo } from '../../../../intefaces/roommate.interface';
import { RoommateService } from '../../../../services/roommate/roommate.service';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from '../../../../services/dialog-service/dialog.service';

@Component({
  selector: 'app-roommate-searching',
  templateUrl: './roommate-searching.component.html',
  styleUrl: './roommate-searching.component.scss',
})
export class RoommateSearchingComponent implements OnInit, OnDestroy {
  public roommatePosts: RoommatePostInfo[] = [];
  public currentPostIndex = 0;
  private userId = '';
  private unsubscribe$ = new Subject<void>();

  constructor(
    private roommateService: RoommateService,
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

  get currentPost(): RoommatePostInfo | null {
    return this.roommatePosts[this.currentPostIndex] || null;
  }

  get preferenceKeys() {
    return Object.entries(this.currentPost?.userPreferences || {})
      .filter(([key]) => !['id', 'userId'].includes(key))
      .map(([key, value]) => ({
        label: this.formatKey(key),
        value,
      }));
  }

  public loadRoommateRequests(): void {
    this.roommateService.getPosts(this.userId).subscribe({
      next: (posts) => {
        this.roommatePosts = posts;

        if (posts.length === 0) {
          this.dialogService.showInfo(
            'No roommate posts are currently available. Please check back later.',
            'No Posts Available'
          );
        }
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.dialogService.showError(
          'Failed to load roommate posts. Please try again later.',
          'Loading Error'
        );
      },
    });
  }

  public swipe(action: 'like' | 'dislike'): void {
    const postId = this.currentPost?.roommatePost.id;

    if (!postId || !this.userId) {
      this.dialogService.showWarning(
        'Unable to perform this action. Please try again.',
        'Action Failed'
      );
      return;
    }

    this.roommateService.swipe(this.userId, postId, action).subscribe({
      next: () => {
        if (action === 'like') {
          this.dialogService.showSuccess(
            'You liked this roommate post!',
            'Like Successful',
            'OK',
            true
          );
        } else {
          this.dialogService.showInfo('You skipped this roommate post.', 'Post Skipped', 'OK');
        }

        this.currentPostIndex++;

        if (this.currentPostIndex >= this.roommatePosts.length) {
          this.dialogService.showInfo(
            "You've viewed all available roommate posts. Check back later for new posts.",
            'End of Posts'
          );
        }
      },
      error: (err) => {
        console.error('Error swiping:', err);
        this.dialogService.showError(
          `Failed to ${action} this roommate post. Please try again.`,
          'Action Failed'
        );
      },
    });
  }

  private formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  private initializeData(): void {
    this.authService.loggedUser$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (user) => {
        if (!user.id) {
          this.dialogService
            .showWarning(
              'You need to be logged in to search for roommates.',
              'Authentication Required'
            )
            .subscribe(() => {
              this.authService.handleUnAuthorizedUser();
            });
        } else {
          this.userId = user.id;
          this.loadRoommateRequests();
        }
      },
      error: (err) => {
        console.error('Error getting user:', err);
        this.dialogService.showError(
          'Failed to retrieve your user information. Please try logging in again.',
          'Authentication Error'
        );
      },
    });
  }
}
