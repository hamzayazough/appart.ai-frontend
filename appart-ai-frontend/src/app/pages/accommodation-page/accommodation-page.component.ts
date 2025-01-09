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


@Component({
  selector: 'app-accommodation-page',
  templateUrl: './accommodation-page.component.html',
  styleUrl: './accommodation-page.component.scss'
})
export class AccommodationPageComponent implements OnInit, OnDestroy {
  accommodationId!: string;
  accommodation!: Accommodation;
  public numPeopleInterested = 0;
  private user: AppUser = {} as AppUser;
  public isInUserPublicInterests = false;
  public isInUserPrivateInterests = false;
  private unsubscribe$ = new Subject<void>();
  

  constructor(
    private route: ActivatedRoute,
    private accommodationsService: AccommodationsService,
    private authService: AuthenticationService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
    this.accommodationsService.getInterestedPeople(this.accommodationId).subscribe(
      (interestedUsers: AppUser[]) => {
        this.dialog.open(InterestedPeopleDialogComponent, {
          data: {
            interestedPeople: interestedUsers,
          },
        });
      },
      (error) => {
        console.error('Error fetching interested people', error);
      });
  }



  public addToFavorites(accommodationId: string): void {
    if (!this.user || !this.user.id) {
      alert('Please login to show your interest');
      return;
    }
    if(this.isInUserPrivateInterests) return;
    this.accommodationsService.addToFavorites(accommodationId, this.user.id).subscribe(
      (numInterested) => {
        this.accommodation.numInterestedPublic = numInterested;
        this.setNumPeopleInterested();
        this.isInUserPublicInterests = false;
        this.isInUserPrivateInterests = true;
        this.snack.open('Apartment added to your favorites privately', 'Close', {
          duration: 3000,
        });
      },
      (error) => {
        console.error('Error adding accommodation to favorites', error);
      }
    );
  }
  public expressMyInterestPublicly(accommodationId: string): void {
    if (!this.user || !this.user.id) {
        alert('Please login to show your interest');
        return;
    }

    if(this.isInUserPublicInterests) return;
    this.accommodationsService.expressMyInterest(accommodationId, this.user.id).subscribe(
        (numInterested) => {
          this.accommodation.numInterestedPublic = numInterested;
          this.setNumPeopleInterested();
          this.isInUserPublicInterests = true;
          this.isInUserPrivateInterests = false;
          this.snack.open('Everybody can see that you are interested', 'Close', {
              duration: 3000,
          });
        },
        (error) => {
          alert('Error expressing interest'); 
          console.error('Error expressing interest', error);
        }
    );
}

  public incrementViews(accommodationId: string): void {
    if (!this.user || !this.user.id) return;
    this.accommodationsService.incrementViews(accommodationId, this.user.id).subscribe(
      (numViews) => {
        this.accommodation.numViews = numViews;
      },
      (error) => {
        console.error('Error incrementing views', error);
      }
    );
  }

  public contactLandlord(): void {
    const landlordInfo: LandlordInfo = {
      landlordName: this.accommodation.ownerName,
      landlordEmail: this.accommodation.ownerEmail,
      landlordPhone: this.accommodation.ownerPhone,
    };
    this.dialog.open(ContactLandLordComponent, {
      data: landlordInfo,
    });
  
    
  }

  private getUserInterest(): void {
    if (!this.user || !this.user.id) return;
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
    this.numPeopleInterested = this.accommodation.numInterestedPublic ;
  }

  private initializeData(): void {
    this.authService.loggedUser$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((user) => {
      if (!user.id) {
        this.authService.handleUnAuthorizedUser();
      } else {
        this.user = user;
        this.setUpAccommodation();
      }
    });
  }

  private setUpAccommodation(): void {
    this.accommodationId = this.route.snapshot.paramMap.get('accommodationId') || '';
    if (this.accommodationId) {
      this.accommodationsService.getAccommodationById(this.accommodationId).subscribe(
        (data: Accommodation) => {
          this.accommodation = data;
          this.setNumPeopleInterested();
          this.getUserInterest();
          this.incrementViews(this.accommodationId);
        },
        (error) => {
          console.error('Error fetching accommodation', error);
        }
      );
    }
  }
  
}
