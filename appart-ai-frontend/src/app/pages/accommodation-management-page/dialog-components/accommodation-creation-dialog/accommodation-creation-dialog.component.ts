import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccommodationManagingService } from '../../../../services/accommodation-managing/accommodation-managing.service';
import { Accommodation } from '../../../../intefaces/accommodation.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageUrl } from '../../../../intefaces/image.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenService } from '../../../../services/token-service/token.service';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
@Component({
  selector: 'app-accommodation-creation-dialog',
  templateUrl: './accommodation-creation-dialog.component.html',
  styleUrl: './accommodation-creation-dialog.component.scss'
})
export class AccommodationCreationDialogComponent implements OnInit, OnDestroy {
  public accommodationForm: FormGroup = {} as FormGroup;
  public selectedFiles: File[] = [];
  public imagePreviews: string[] = [];
  public actualAccommodationImages: ImageUrl[] = [];
  private accommodationId: string = "";
  private accommodationOfferDate: Date | undefined;
  private unsubscribe$ = new Subject<void>();




  constructor(
    public dialogRef: MatDialogRef<AccommodationCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, private accommodationService: AccommodationManagingService, private snackBar: MatSnackBar, private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.initializeForm(this.data);
    this.initializeToken();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onAddressSelected(address: any): void {
    this.accommodationForm.patchValue({
      address: {
        placeName: address.placeName,
        apartmentNumber: address.apartmentNumber,
        location: address.location
      }
    });
  }

  public onFileSelected(event: any): void {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  public removeImage(imagePreview: string): void {
    const index = this.imagePreviews.indexOf(imagePreview);
    if (index > -1) {
      this.imagePreviews.splice(index, 1);
      this.selectedFiles.splice(index, 1);
    }
  }

  public getPlaceName(): string {
    const placeName = this.accommodationForm.get('address.placeName')?.value;
    return placeName || '';
  }
  
  public getApartmentNumber(): string {
    const apartmentNumber = this.accommodationForm.get('address.apartmentNumber')?.value;
    return apartmentNumber || '';
  }
  

  public async save(): Promise<void> {
    if (!this.accommodationForm.valid) {
      console.error('Form is invalid or no token available');
      return;
    }

    const accommodation: Accommodation = {
      ...this.accommodationForm.value,
      id: this.accommodationId,
      offerDate: this.accommodationOfferDate,
      ownerId: this.authService.getUser()?.id || '',
    };

    this.accommodationService.addAccommodation(accommodation, this.selectedFiles).subscribe({
      next: (accommodation: Accommodation) => {
        this.snackBar.open('Accommodation created successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(accommodation);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error creating accommodation:', error);
        this.snackBar.open('Failed to save accommodation', 'Close', { duration: 3000 });
      },
    });
  }
  

  public async removeExistingImage(image: ImageUrl): Promise<void> {
    this.accommodationService
      .deleteAccommodationImage(this.accommodationId, image.imageUrl)
      .subscribe({
        next: () => {
          const index = this.actualAccommodationImages.indexOf(image);
          if (index > -1) {
            this.actualAccommodationImages.splice(index, 1);
          }
          this.snackBar.open('Image deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting image:', error);
          this.snackBar.open('Failed to delete image', 'Close', { duration: 3000 });
        },
      });
  }
  
  public cancel(): void {
    this.dialogRef.close();
  }


  private initializeForm(data: any): void {
    this.accommodationId = data.accommodation?.id || '';
    this.accommodationOfferDate = data.accommodation?.offerDate;

    this.accommodationForm = this.fb.group({
      title: [data.accommodation?.title || '', Validators.required],
      rentPrice: [data.accommodation?.rentPrice || '', Validators.required],
      description: [data.accommodation?.description || '', Validators.required],
      numBeds: [data.accommodation?.numBeds || '', Validators.required],
      numBathrooms: [data.accommodation?.numBathrooms || '', Validators.required],
      squareFootage: [data.accommodation?.squareFootage || '', Validators.required],
      availableFrom: [data.accommodation?.availableFrom || '', Validators.required],
      leaseDuration: [data.accommodation?.leaseDuration || '', Validators.required],
      floorNumber: [data.accommodation?.floorNumber || ''],
      availabilityStatus: [data.accommodation?.availabilityStatus || 'Available', Validators.required],
      address: this.fb.group({
        placeName: [data.accommodation?.address?.placeName, Validators.required],
        apartmentNumber: [data.accommodation?.address?.apartmentNumber || ''],
        location: [data.accommodation?.address?.location, Validators.required],
      }),
      airConditioning: [data.accommodation?.airConditioning || false],
      dishwasher: [data.accommodation?.dishwasher || false],
      stainlessSteelAppliances: [data.accommodation?.stainlessSteelAppliances || false],
      patio: [data.accommodation?.patio || false],
      balcony: [data.accommodation?.balcony || false],
      refrigerator: [data.accommodation?.refrigerator || false],
      petsAllowed: [data.accommodation?.petsAllowed || false],
      smokingAllowed: [data.accommodation?.smokingAllowed || false],
      gym: [data.accommodation?.gym || false],
      parkingIncluded: [data.accommodation?.parkingIncluded || false],
      roommateAccepted: [data.accommodation?.roommateAccepted || false],
      furnished: [data.accommodation?.furnished || false],
      utilitiesIncluded: [data.accommodation?.utilitiesIncluded || false],
    });
  }

  private async initializeToken(): Promise<void> {
    if (this.accommodationId) {
      this.accommodationService
        .getImagesAssociatedToAccommodation(this.accommodationId)
        .subscribe((images: ImageUrl[]) => {
          this.actualAccommodationImages = images;
        });
    }
  }

}
