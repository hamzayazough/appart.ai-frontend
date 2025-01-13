import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { Router } from '@angular/router';
import { SelectedHeader } from '../../../enums/selected-header.enum';

@Component({
  selector: 'app-landing-header',
  templateUrl: './landing-header.component.html',
  styleUrl: './landing-header.component.scss',
})
export class LandingHeaderComponent {
  @Input() public selected: SelectedHeader = SelectedHeader.home;
  public selectedHeader = SelectedHeader;
  public userId: string | undefined = undefined;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.subscribeToLoggedUser();
  }

  public goToProfile(): void {
    this.router.navigate([`/account/${this.userId}`]);
  }

  public goToHomePage(): void {
    this.router.navigate([`/home`]);
    this.selected = SelectedHeader.home;
  }

  public onBrowseClick(): void {
    if (this.userId) {
      this.router.navigate([`/map/authenticated`]);
    } else {
      this.router.navigate([`/map`]);
    }
  }

  private subscribeToLoggedUser(): void {
    this.authService.loggedUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
      } else {
        this.userId = undefined;
      }
    });
  }
}
