import { Component, EventEmitter, Input, Output } from "@angular/core"
import { AccommodationMatchingDTO } from "../../../intefaces/accommodation.interface"
import { Router } from "@angular/router"
import { AuthenticationService } from "../../../services/auth/authentication.service"
enum SelectedHeader {
  home = "home",
  map = "map",
  roommate = "roommate",
  profile = "profile",
}

@Component({
  selector: "app-map-sidebar",
  templateUrl: "./map-sidebar.component.html",
  styleUrl: "./map-sidebar.component.scss",
})
export class MapSidebarComponent {
  @Input() data: AccommodationMatchingDTO[] = []
  @Input() matchingFeature = false
  @Input() opened = true // Add this input property
  @Output() sidebarToggle = new EventEmitter<void>()

  public selected: SelectedHeader = SelectedHeader.map
  public selectedHeader = SelectedHeader

  // Pagination
  public currentPage = 1
  public itemsPerPage = 10

  private userId: string | undefined = undefined

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {
    this.subscribeToLoggedUser()
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.itemsPerPage)
  }

  public toggleSidebar(): void {
    this.sidebarToggle.emit()
  }

  public prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++
    }
  }

  public goToProfile(): void {
    if (this.userId) {
      this.router.navigate([`/account/${this.userId}`])
      this.selected = SelectedHeader.profile
    } else {
      // Redirect to login if not authenticated
      this.router.navigate(["/login"])
    }
  }

  public goToHomePage(): void {
    this.router.navigate([`/home`])
    this.selected = SelectedHeader.home
  }

  public onBrowseClick(): void {
    if (this.userId) {
      this.router.navigate([`/map/authenticated`])
    } else {
      this.router.navigate([`/map`])
    }
    this.selected = SelectedHeader.map
  }

  public goToRoommates(): void {
    if (this.userId) {
      this.router.navigate([`/r`])
      this.selected = SelectedHeader.roommate
    } else {
      this.router.navigate(["/login"])
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
