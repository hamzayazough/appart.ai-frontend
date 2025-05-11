import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccommodationMatchingDetailsDTO } from '../../intefaces/accommodation.interface';
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
import { Title, Meta } from '@angular/platform-browser';
import { DialogService } from '../../services/dialog-service/dialog.service';

@Component({
  selector: 'app-accommodation-page',
  templateUrl: './accommodation-page.component.html',
  styleUrl: './accommodation-page.component.scss',
})
export class AccommodationPageComponent implements OnInit, OnDestroy {
  accommodationId!: string;
  accommodation!: AccommodationMatchingDetailsDTO;
  public numPeopleInterested = 0;
  private user: AppUser = {} as AppUser;
  public isInUserPublicInterests = false;
  public isInUserPrivateInterests = false;
  private unsubscribe$ = new Subject<void>();
  private isUserAuthenticated = false;

  public images: Image[] = [];
  public currentImageIndex = 0;
  private autoSlideInterval: any = null;

  constructor(
    private route: ActivatedRoute,
    private accommodationsService: AccommodationsService,
    private authService: AuthenticationService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private titleService: Title,
    private metaService: Meta,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public prevImage(event: Event): void {
    event.stopPropagation();
    this.stopAutoSlide();
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  public nextImage(event: Event): void {
    event.stopPropagation();
    this.stopAutoSlide();
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  public setCurrentImage(index: number, event: Event): void {
    event.stopPropagation();
    this.stopAutoSlide();
    this.currentImageIndex = index;
  }

  public getPrevIndex(): number {
    return (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  public getNextIndex(): number {
    return (this.currentImageIndex + 1) % this.images.length;
  }

  private startAutoSlide(): void {
    if (this.images.length <= 1) return;

    this.autoSlideInterval = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 5000);
  }

  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  public convertToImage(imageUrl: ImageUrl[]): Image[] {
    return imageUrl.map((image) => {
      return {
        src: image.imageUrl,
        alt: image.imageAlt || 'Accommodation image',
      };
    });
  }

  public showInterestedPeople(): void {
    if (!this.isUserAuthenticated) {
      this.openLoginDialog();
      return;
    }

    this.accommodationsService.getInterestedPeople(this.accommodationId).subscribe(
      (interestedUsers: AppUser[]) => {
        this.dialog.open(InterestedPeopleDialogComponent, {
          data: {
            interestedPeople: interestedUsers,
          },
          width: '500px',
          maxWidth: '90vw',
        });
      },
      (error) => {
        console.error('Error fetching interested people', error);
        this.snack.open('Could not load interested people', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  public addToFavorites(accommodationId: string): void {
    if (!this.isUserAuthenticated) {
      this.openLoginDialog();
      return;
    }

    if (this.isInUserPrivateInterests) return;

    this.accommodationsService.addToFavorites(accommodationId, this.user.id).subscribe(
      (numInterested) => {
        this.accommodation.accommodation.numInterestedPrivate = numInterested;
        this.setNumPeopleInterested();
        this.isInUserPublicInterests = false;
        this.isInUserPrivateInterests = true;
        this.snack.open('Added to your favorites', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
      },
      (error) => {
        console.error('Error adding to favorites', error);
        this.snack.open('Could not add to favorites', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  public expressMyInterestPublicly(accommodationId: string): void {
    if (!this.isUserAuthenticated) {
      this.openLoginDialog();
      return;
    }

    if (this.isInUserPublicInterests) {
      this.accommodationsService.expressMyInterest(accommodationId, this.user.id).subscribe(
        (numInterested: number) => {
          this.accommodation.accommodation.numInterestedPublic = numInterested;
          this.setNumPeopleInterested();
          this.isInUserPublicInterests = false;
          this.snack.open('Interest removed', 'Close', {
            duration: 3000,
          });
        },
        (error: any) => {
          console.error('Error removing interest', error);
          this.snack.open('Could not remove interest', 'Close', {
            duration: 3000,
          });
        }
      );
      return;
    }

    this.accommodationsService.expressMyInterest(accommodationId, this.user.id).subscribe(
      (numInterested: number) => {
        this.accommodation.accommodation.numInterestedPublic = numInterested;
        this.setNumPeopleInterested();
        this.isInUserPublicInterests = true;
        this.isInUserPrivateInterests = false;
        this.snack.open('Interest expressed publicly', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
      },
      (error: any) => {
        console.error('Error expressing interest', error);
        this.snack.open('Could not express interest', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  public incrementViews(accommodationId: string): void {
    if (!this.isUserAuthenticated) {
      return;
    }
    this.accommodationsService.incrementViews(accommodationId, this.user.id).subscribe(
      (numViews) => {
        this.accommodation.accommodation.numViews = numViews;
      },
      (error) => {
        console.error('Error incrementing views', error);
      }
    );
  }

  public contactLandlord(): void {
    if (!this.isUserAuthenticated) {
      this.openLoginDialog();
      return;
    }
    console.log('Contacting landlord:', this.accommodation.accommodation);
    const landlordInfo: LandlordInfo = {
      landlordName: this.accommodation.accommodation.ownerName,
      landlordEmail: this.accommodation.accommodation.ownerEmail,
      landlordPhone:
        this.accommodation.accommodation.ownerCellphone ||
        this.accommodation.accommodation.ownerPhone,
    };

    this.dialog.open(ContactLandLordComponent, {
      data: landlordInfo,
      width: '500px',
      maxWidth: '90vw',
    });
  }

  public getPercentage(value: number): number {
    return Math.round(value * 100);
  }

  public getTransportIcon(mode: string): string {
    switch (mode.toLowerCase()) {
      case 'walking':
        return 'directions_walk';
      case 'transit':
      case 'bus':
        return 'directions_bus';
      case 'subway':
      case 'train':
        return 'train';
      case 'bicycling':
      case 'cycling':
        return 'directions_bike';
      case 'driving':
      case 'car':
        return 'directions_car';
      default:
        return 'directions';
    }
  }

  public viewDetails(): void {
    if (this.accommodation.accommodation.detailsLink) {
      window.open(this.accommodation.accommodation.detailsLink, '_blank');
    } else {
      this.snack.open('No external details link available', 'Close', {
        duration: 3000,
      });
    }
  }

  private getUserInterest(): void {
    if (!this.isUserAuthenticated) {
      return;
    }

    this.accommodationsService.getUserInterest(this.accommodationId, this.user.id).subscribe(
      (interest) => {
        switch (interest) {
          case 'noInterest':
            this.isInUserPrivateInterests = false;
            this.isInUserPublicInterests = false;
            break;
          case 'publicInterest':
            this.isInUserPublicInterests = true;
            this.isInUserPrivateInterests = false;
            break;
          case 'privateInterest':
            this.isInUserPrivateInterests = true;
            this.isInUserPublicInterests = false;
            break;
          default:
            break;
        }
      },
      (error: Error) => {
        console.error('Error fetching user interest', error);
      }
    );
  }

  private setNumPeopleInterested(): void {
    this.numPeopleInterested = this.accommodation.accommodation.numInterestedPublic;
  }

  private openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, {
      data: {
        message: 'Please login to continue',
      },
      width: '400px',
      maxWidth: '90vw',
    });
  }

  private initializeData(): void {
    this.subscribeToAuthentication();
  }

  private setUpAccommodation(): void {
    if (!this.user || !this.user.id) {
      this.dialogService.showError('Please login or register to continue', 'User not found');
      return;
    }
    this.accommodationId = this.route.snapshot.paramMap.get('accommodationId') || '';
    if (this.accommodationId) {
      this.accommodationsService.getAccommodationById(this.accommodationId, this.user.id).subscribe(
        (data: AccommodationMatchingDetailsDTO) => {
          this.accommodation = data;
          this.setNumPeopleInterested();
          this.getUserInterest();
          this.incrementViews(this.accommodationId);
          this.updateMetaTags();

          this.images = this.convertToImage(this.accommodation.accommodation.imageUrls || []);

          if (this.images.length > 1) {
            this.startAutoSlide();
          }
        },
        (error) => {
          console.error('Error fetching accommodation', error);
          this.snack.open('Could not load accommodation details', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }

  private updateMetaTags(): void {
    if (!this.accommodation) return;

    this.titleService.setTitle(`${this.accommodation.accommodation.title} | RoomMatch`);

    this.metaService.updateTag({
      name: 'description',
      content: this.accommodation.accommodation.description.substring(0, 160),
    });

    if (this.accommodation.accommodation.imageUrls.length > 0) {
      this.metaService.updateTag({
        property: 'og:image',
        content: this.accommodation.accommodation.imageUrls[0].imageUrl,
      });
    }
  }

  private subscribeToAuthentication(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((isAuthenticated) => {
        this.isUserAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          const user = this.authService.getStoredUser();
          if (user) {
            this.user = user;
            this.setUpAccommodation();
          } else {
            this.authService.handleUnAuthorizedUser();
          }
        }
      });
  }
}
