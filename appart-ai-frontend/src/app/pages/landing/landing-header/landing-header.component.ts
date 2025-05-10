import { Component, Input, HostListener } from '@angular/core';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { Router } from '@angular/router';
import { SelectedHeader } from '../../../enums/selected-header.enum';

@Component({
  selector: 'app-landing-header',
  templateUrl: './landing-header.component.html',
  styleUrl: './landing-header.component.scss',
})
export class LandingHeaderComponent {
  @Input() public selected: SelectedHeader = SelectedHeader.home
  public selectedHeader = SelectedHeader
  public userId: string | undefined = undefined
  public mobileMenuOpen = false
  public scrolled = false

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {
    this.subscribeToLoggedUser()
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 20
  }

  @HostListener("window:resize", [])
  onResize() {
    if (window.innerWidth > 768 && this.mobileMenuOpen) {
      this.mobileMenuOpen = false
    }
  }

  public toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen
    // Prevent scrolling when menu is open
    document.body.style.overflow = this.mobileMenuOpen ? "hidden" : ""
  }

  public goToProfile(): void {
    if (this.userId) {
      this.router.navigate([`/account/${this.userId}`])
      this.closeMobileMenu()
    } else {
      // Handle case when user is not logged in
      this.router.navigate(["/login"])
    }
  }

  public goToHomePage(): void {
    this.router.navigate([`/home`])
    this.selected = SelectedHeader.home
    this.closeMobileMenu()
  }

  public onBrowseClick(): void {
    if (this.userId) {
      this.router.navigate([`/map/authenticated`])
    } else {
      this.router.navigate([`/map`])
    }
    this.selected = SelectedHeader.browse
    this.closeMobileMenu()
  }

  public closeMobileMenu(): void {
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false
      document.body.style.overflow = ""
    }
  }

  private subscribeToLoggedUser(): void {
    this.authService.loggedUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id
      } else {
        this.userId = undefined
      }
    })
  }
}
