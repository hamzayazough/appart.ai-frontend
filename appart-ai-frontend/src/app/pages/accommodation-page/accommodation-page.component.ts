import { Component, OnDestroy, OnInit } from '@angular/core';
import { Accommodation } from '../../intefaces/accommodation.interface';
import { ActivatedRoute } from '@angular/router';
import { AccommodationsService } from '../../services/accomodations/accomodations.service';
import { Image, ImageUrl } from '../../intefaces/image.interface';
import { AppUser, LandlordInfo } from '../../intefaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { InterestedPeopleDialogComponent } from '../../dialogs/interested-people-dialog/interested-people-dialog.component';
import { ContactLandLordComponent } from '../accommodation-management-page/dialog-components/contact-land-lord/contact-land-lord.component';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { Subject, takeUntil } from 'rxjs';
import { LoginDialogComponent } from '../../dialogs/login-dialog/login-dialog.component';
import { Title, Meta } from "@angular/platform-browser";

@Component({
  selector: "app-accommodation-page",
  templateUrl: "./accommodation-page.component.html",
  styleUrl: "./accommodation-page.component.scss",
})
export class AccommodationPageComponent implements OnInit, OnDestroy {
  accommodationId!: string
  accommodation!: Accommodation
  public numPeopleInterested = 0
  private user: AppUser = {} as AppUser
  public isInUserPublicInterests = false
  public isInUserPrivateInterests = false
  private unsubscribe$ = new Subject<void>()
  private isUserAuthenticated = false

  // Image gallery properties
  public images: Image[] = []
  public currentImageIndex = 0
  private autoSlideInterval: any = null

  constructor(
    private route: ActivatedRoute,
    private accommodationsService: AccommodationsService,
    private authService: AuthenticationService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private titleService: Title,
    private metaService: Meta,
  ) {}

  ngOnInit(): void {
    this.initializeData()
  }

  ngOnDestroy(): void {
    this.stopAutoSlide()
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  // Image gallery methods
  public prevImage(event: Event): void {
    event.stopPropagation()
    this.stopAutoSlide()
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length
  }

  public nextImage(event: Event): void {
    event.stopPropagation()
    this.stopAutoSlide()
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length
  }

  public setCurrentImage(index: number, event: Event): void {
    event.stopPropagation()
    this.stopAutoSlide()
    this.currentImageIndex = index
  }

  // Helper methods for carousel display
  public getPrevIndex(): number {
    return (this.currentImageIndex - 1 + this.images.length) % this.images.length
  }

  public getNextIndex(): number {
    return (this.currentImageIndex + 1) % this.images.length
  }

  private startAutoSlide(): void {
    if (this.images.length <= 1) return

    this.autoSlideInterval = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length
    }, 5000)
  }

  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval)
      this.autoSlideInterval = null
    }
  }

  public convertToImage(imageUrl: ImageUrl[]): Image[] {
    return imageUrl.map((image) => {
      return {
        src: image.imageUrl,
        alt: image.imageAlt || "Accommodation image",
      }
    })
  }

  public showInterestedPeople(): void {
    if (!this.isUserAuthenticated) {
      this.openLoginDialog()
      return
    }

    this.accommodationsService.getInterestedPeople(this.accommodationId).subscribe(
      (interestedUsers: AppUser[]) => {
        this.dialog.open(InterestedPeopleDialogComponent, {
          data: {
            interestedPeople: interestedUsers,
          },
          width: "500px",
          maxWidth: "90vw",
        })
      },
      (error) => {
        console.error("Error fetching interested people", error)
        this.snack.open("Could not load interested people", "Close", {
          duration: 3000,
        })
      },
    )
  }

  public addToFavorites(accommodationId: string): void {
    if (!this.isUserAuthenticated) {
      this.openLoginDialog()
      return
    }

    if (this.isInUserPrivateInterests) return

    this.accommodationsService.addToFavorites(accommodationId, this.user.id).subscribe(
      (numInterested) => {
        this.accommodation.numInterestedPrivate = numInterested
        this.setNumPeopleInterested()
        this.isInUserPublicInterests = false
        this.isInUserPrivateInterests = true
        this.snack.open("Added to your favorites", "Close", {
          duration: 3000,
          panelClass: "success-snackbar",
        })
      },
      (error) => {
        console.error("Error adding to favorites", error)
        this.snack.open("Could not add to favorites", "Close", {
          duration: 3000,
        })
      },
    )
  }

  public expressMyInterestPublicly(accommodationId: string): void {
    if (!this.isUserAuthenticated) {
      this.openLoginDialog()
      return
    }

    if (this.isInUserPublicInterests) {
      // Instead of removePublicInterest, we use expressMyInterest to toggle
      this.accommodationsService.expressMyInterest(accommodationId, this.user.id).subscribe(
        (numInterested: number) => {
          this.accommodation.numInterestedPublic = numInterested
          this.setNumPeopleInterested()
          this.isInUserPublicInterests = false
          this.snack.open("Interest removed", "Close", {
            duration: 3000,
          })
        },
        (error: any) => {
          console.error("Error removing interest", error)
          this.snack.open("Could not remove interest", "Close", {
            duration: 3000,
          })
        },
      )
      return
    }

    this.accommodationsService.expressMyInterest(accommodationId, this.user.id).subscribe(
      (numInterested: number) => {
        this.accommodation.numInterestedPublic = numInterested
        this.setNumPeopleInterested()
        this.isInUserPublicInterests = true
        this.isInUserPrivateInterests = false
        this.snack.open("Interest expressed publicly", "Close", {
          duration: 3000,
          panelClass: "success-snackbar",
        })
      },
      (error: any) => {
        console.error("Error expressing interest", error)
        this.snack.open("Could not express interest", "Close", {
          duration: 3000,
        })
      },
    )
  }

  public incrementViews(accommodationId: string): void {
    if (!this.isUserAuthenticated) {
      return
    }
    this.accommodationsService.incrementViews(accommodationId, this.user.id).subscribe(
      (numViews) => {
        this.accommodation.numViews = numViews
      },
      (error) => {
        console.error("Error incrementing views", error)
      },
    )
  }

  public contactLandlord(): void {
    if (!this.isUserAuthenticated) {
      this.openLoginDialog()
      return
    }

    const landlordInfo: LandlordInfo = {
      landlordName: this.accommodation.ownerName,
      landlordEmail: this.accommodation.ownerEmail,
      landlordPhone: this.accommodation.ownerPhone,
    }

    this.dialog.open(ContactLandLordComponent, {
      data: landlordInfo,
      width: "500px",
      maxWidth: "90vw",
    })
  }

  private getUserInterest(): void {
    if (!this.isUserAuthenticated) {
      return
    }

    this.accommodationsService.getUserInterest(this.accommodationId, this.user.id).subscribe(
      (interest) => {
        switch (interest) {
          case "noInterest":
            this.isInUserPrivateInterests = false
            this.isInUserPublicInterests = false
            break
          case "publicInterest":
            this.isInUserPublicInterests = true
            this.isInUserPrivateInterests = false
            break
          case "privateInterest":
            this.isInUserPrivateInterests = true
            this.isInUserPublicInterests = false
            break
          default:
            break
        }
      },
      (error: Error) => {
        console.error("Error fetching user interest", error)
      },
    )
  }

  private setNumPeopleInterested(): void {
    this.numPeopleInterested = this.accommodation.numInterestedPublic
  }

  private openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, {
      data: {
        message: "Please login to continue",
      },
      width: "400px",
      maxWidth: "90vw",
    })
  }

  private initializeData(): void {
    this.subscribeToAuthentication()
    this.setUpAccommodation()
  }

  private setUpAccommodation(): void {
    this.accommodationId = this.route.snapshot.paramMap.get("accommodationId") || ""
    if (this.accommodationId) {
      this.accommodationsService.getAccommodationById(this.accommodationId).subscribe(
        (data: Accommodation) => {
          this.accommodation = data
          this.setNumPeopleInterested()
          this.getUserInterest()
          this.incrementViews(this.accommodationId)
          this.updateMetaTags()

          // Set up images for the gallery
          this.images = this.convertToImage(this.accommodation.imageUrls || [])

          // Start auto slide if there are multiple images
          if (this.images.length > 1) {
            this.startAutoSlide()
          }
        },
        (error) => {
          console.error("Error fetching accommodation", error)
          this.snack.open("Could not load accommodation details", "Close", {
            duration: 3000,
          })
        },
      )
    }
  }

  private updateMetaTags(): void {
    if (!this.accommodation) return

    this.titleService.setTitle(`${this.accommodation.title} | RoomMatch`)

    this.metaService.updateTag({
      name: "description",
      content: this.accommodation.description.substring(0, 160),
    })

    if (this.accommodation.imageUrls.length > 0) {
      this.metaService.updateTag({
        property: "og:image",
        content: this.accommodation.imageUrls[0].imageUrl,
      })
    }
  }

  private subscribeToAuthentication(): void {
    this.authService.isAuthenticated$.pipe(takeUntil(this.unsubscribe$)).subscribe((isAuthenticated) => {
      this.isUserAuthenticated = isAuthenticated
      if (isAuthenticated) {
        const user = this.authService.getStoredUser()
        if (user) {
          this.user = user
        } else {
          this.authService.handleUnAuthorizedUser()
        }
      }
    })
  }
}
