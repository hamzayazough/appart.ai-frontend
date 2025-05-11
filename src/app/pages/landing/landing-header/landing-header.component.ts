import { Component, Input, HostListener } from '@angular/core';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { UserService } from '../../../services/user-service/user.service';
import { Router } from '@angular/router';
import { SelectedHeader } from '../../../enums/selected-header.enum';
import { MatDialog } from '@angular/material/dialog';
import { AccessRestrictionDialogComponent } from './components/access-restriction-dialog/access-restriction-dialog.component';
import { UserPreferences } from '../../../intefaces/user-preferences.interface';

@Component({
  selector: 'app-landing-header',
  templateUrl: './landing-header.component.html',
  styleUrl: './landing-header.component.scss',
})
export class LandingHeaderComponent {
  @Input() public selected: SelectedHeader = SelectedHeader.home;
  public selectedHeader = SelectedHeader;
  public userId: string | undefined = undefined;
  public userPreferences: UserPreferences | null = null;
  public mobileMenuOpen = false;
  public scrolled = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.subscribeToLoggedUser();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 20;
  }

  @HostListener('window:resize', [])
  onResize() {
    if (window.innerWidth > 768 && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
    }
  }

  public toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  public goToProfile(): void {
    if (this.userId) {
      this.router.navigate([`/account/${this.userId}`]);
      this.closeMobileMenu();
    } else {
      this.openAccessRestrictionDialog('profile', 'Please log in to access your profile.');
    }
  }

  public goToHomePage(): void {
    this.router.navigate([`/home`]);
    this.selected = SelectedHeader.home;
    this.closeMobileMenu();
  }

  public onBrowseClick(): void {
    if (this.userId) {
      if (this.userPreferences) {
        this.router.navigate([`/map/authenticated`]);
      } else {
        this.openAccessRestrictionDialog(
          'map',
          'Please complete your preferences to access the authenticated map view.'
        );
      }
    } else {
      this.openAccessRestrictionDialog('map', 'Please log in to access the full map features.');
    }
    this.selected = SelectedHeader.browse;
    this.closeMobileMenu();
  }

  public onFindRoommatesClick(): void {
    if (this.userId) {
      if (this.userPreferences) {
        this.router.navigate(['/find-roommates']);
        this.selected = SelectedHeader.roommates;
      } else {
        this.openAccessRestrictionDialog(
          'find roommates',
          'Please complete your preferences to access the roommate finder.'
        );
      }
    } else {
      this.openAccessRestrictionDialog(
        'find roommates',
        'Please log in to find potential roommates.'
      );
    }
    this.closeMobileMenu();
  }

  public closeMobileMenu(): void {
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  private openAccessRestrictionDialog(feature: string, message: string): void {
    this.dialog.open(AccessRestrictionDialogComponent, {
      width: '400px',
      data: {
        feature: feature,
        message: message,
        isLoggedIn: !!this.userId,
      },
    });
  }

  private loadUserPreferences(): void {
    if (this.userId) {
      this.userService.getUserPreferences(this.userId).subscribe({
        next: (preferences) => {
          this.userPreferences = preferences;
        },
        error: (error) => {
          console.log('error fetching user preferences', error);
        },
      });
    }
  }

  private subscribeToLoggedUser(): void {
    this.authService.loggedUser$.subscribe((user) => {
      if (user && user.id) {
        this.userId = user.id;
        this.loadUserPreferences();
      } else {
        this.userId = undefined;
        this.userPreferences = null;
      }
    });
  }
}
