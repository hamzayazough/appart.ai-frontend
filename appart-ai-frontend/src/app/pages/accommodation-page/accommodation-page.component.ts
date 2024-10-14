import { Component, NgModule, OnInit } from '@angular/core';
import { Accommodation } from '../../intefaces/accommodation.interface';
import { ActivatedRoute } from '@angular/router';
import { AccommodationsService } from '../../services/accomodations/accomodations.service';
import { Image, ImageUrl } from '../../intefaces/image.interface';
import { UserService } from '../../services/user-service/user.service';
import { AppUser } from '../../intefaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { InterestedPeopleDialogComponent } from '../../dialogs/interested-people-dialog/interested-people-dialog.component';


@Component({
  selector: 'app-accommodation-page',
  templateUrl: './accommodation-page.component.html',
  styleUrl: './accommodation-page.component.scss'
})
export class AccommodationPageComponent implements OnInit {
  accommodationId!: string;
  accommodation!: Accommodation;
  public numPeopleInterested = 0;
  private user: AppUser | null = null;
  public isInUserPublicInterests = false;
  public isInUserPrivateInterests = false;

  constructor(
    private route: ActivatedRoute,
    private accommodationsService: AccommodationsService,
    private userService: UserService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUser();
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


  public createColocationInterest(accommodationId: string): void {
    // this.accommodationsService.createColocationInterest(accommodationId).subscribe(
    //   () => {
    //     console.log('Colocation interest created');
    //   },
    //   (error) => {
    //     console.error('Error creating colocation interest', error);
    //   }
    // );
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

  // TODO: Antoine
  public contactLandlord(ownerId: string): void {
    this.accommodationsService.contactLandlord(ownerId).subscribe(
      () => {
      },
      (error) => {
        console.error('Error contacting landlord', error);
      }
    );
  }

  private getUser(): void {
    this.user =  this.userService.getStoredUser();
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
  
}
