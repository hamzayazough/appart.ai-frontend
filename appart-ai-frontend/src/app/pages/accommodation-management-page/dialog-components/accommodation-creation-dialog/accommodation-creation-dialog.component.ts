import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccommodationManagingService } from '../../../../services/accommodation-managing/accommodation-managing.service';
import { Accommodation } from '../../../../intefaces/accommodation.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageUrl } from '../../../../intefaces/image.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, forkJoin, of, takeUntil } from 'rxjs';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { Location } from '@angular/common';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AppUser } from '../../../../intefaces/user.interface';

@Component({
  selector: 'app-accommodation-creation-dialog',
  templateUrl: './accommodation-creation-dialog.component.html',
  styleUrls: ['./accommodation-creation-dialog.component.scss'],
})
export class AccommodationCreationDialogComponent implements OnInit, OnDestroy {
  public accommodationForm: FormGroup;
  public selectedFiles: File[] = [];
  public imagePreviews: string[] = [];
  public actualAccommodationImages: ImageUrl[] = [];
  private accommodationId = '';
  private accommodationOfferDate: Date | undefined;
  private unsubscribe$ = new Subject<void>();
  public isNew = true;
  public pageTitle = 'Add New Property';
  public isLoading = false;
  public currentStep = 0;
  public formProgress = 0;
  public currentUser: AppUser | null = null;
  public formSteps = [
    { title: 'Basic Info', icon: 'home', completed: false },
    { title: 'Details', icon: 'info', completed: false },
    { title: 'Images', icon: 'photo_library', completed: false },
    { title: 'Address', icon: 'place', completed: false },
    { title: 'Features', icon: 'star', completed: false },
  ];

  constructor(
    private fb: FormBuilder,
    private accommodationService: AccommodationManagingService,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.accommodationForm = this.createForm();
  }

  ngOnInit(): void {
    this.authService.loggedUser$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (user) => {
        if (user && user.id) {
          this.currentUser = user;
          this.loadAccommodationData();
        } else {
          this.snackBar.open('Please log in to continue', 'Close', { duration: 3000 });
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Error getting logged user:', error);
        this.snackBar.open('Authentication error. Please log in again.', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/login']);
      },
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onStepChange(event: StepperSelectionEvent): void {
    this.currentStep = event.selectedIndex;
    this.updateFormProgress();
  }

  public nextStep(): void {
    if (this.currentStep < this.formSteps.length - 1) {
      this.currentStep++;
      this.updateFormProgress();
    }
  }

  public prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateFormProgress();
    }
  }

  private updateFormProgress(): void {
    this.formProgress = ((this.currentStep + 1) / this.formSteps.length) * 100;
    for (let i = 0; i <= this.currentStep; i++) {
      this.formSteps[i].completed = true;
    }
  }

  public onAddressSelected(address: any): void {
    this.accommodationForm.patchValue({
      address: {
        placeName: address.placeName,
        apartmentNumber: address.apartmentNumber,
        location: address.location,
      },
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
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }
    if (!this.currentUser || !this.currentUser.id) {
      this.snackBar.open('You must be logged in to save an accommodation', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.isLoading = true;
    const accommodation: Accommodation = {
      ...this.accommodationForm.value,
      id: this.accommodationId,
      offerDate: this.accommodationOfferDate,
      ownerId: this.currentUser.id,
      numViews: 0,
      numInterestedPrivate: 0,
      numInterestedPublic: 0,
      ownerName: `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim(),
      ownerEmail: this.currentUser.email || '',
      ownerPhone: this.currentUser.phone || '',
      phone: this.currentUser.phone || '',
      imageUrls: [],
    };
    if (this.isNew) {
      this.accommodationService.addAccommodation(accommodation, this.selectedFiles).subscribe({
        next: (accommodation: Accommodation) => {
          this.isLoading = false;
          this.snackBar.open('Accommodation created successfully', 'Close', { duration: 3000 });
          this.navigateBack();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.error('Error creating accommodation:', error);
          this.snackBar.open('Failed to save accommodation', 'Close', { duration: 3000 });
        },
      });
    } else {
      this.accommodationService.updateAccommodation(this.accommodationId, accommodation).subscribe({
        next: () => {
          if (this.selectedFiles.length > 0) {
            const imageOnlyAccommodation: Accommodation = {
              id: this.accommodationId,
              ownerId: this.currentUser?.id || '',
              title: accommodation.title,
              rentPrice: accommodation.rentPrice,
              description: accommodation.description,
              numBeds: accommodation.numBeds,
              numBathrooms: accommodation.numBathrooms,
              squareFootage: accommodation.squareFootage,
              availableFrom: new Date().toISOString(),
              leaseDuration: accommodation.leaseDuration || 0,
              address: {
                placeName: accommodation.address.placeName,
                location: [0, 0],
              },
              availabilityStatus: accommodation.availabilityStatus,
              numViews: 0,
              numInterestedPrivate: 0,
              numInterestedPublic: 0,
              ownerName:
                `${this.currentUser?.firstName || ''} ${this.currentUser?.lastName || ''}`.trim(),
              ownerEmail: this.currentUser?.email || '',
              ownerPhone: this.currentUser?.phone || '',
              phone: this.currentUser?.phone || '',
              airConditioning: false,
              furnished: false,
              utilitiesIncluded: false,
              dishwasher: false,
              stainlessSteelAppliances: false,
              patio: false,
              balcony: false,
              refrigerator: false,
              petsAllowed: false,
              smokingAllowed: false,
              gym: false,
              parkingIncluded: false,
              roommateAccepted: false,
              imageUrls: [],
            };
            this.accommodationService
              .addAccommodation(imageOnlyAccommodation, this.selectedFiles)
              .subscribe({
                next: () => {
                  this.isLoading = false;
                  this.snackBar.open('Accommodation and images updated successfully', 'Close', {
                    duration: 3000,
                  });
                  this.navigateBack();
                },
                error: (error: Error) => {
                  this.isLoading = false;
                  console.error('Error uploading images:', error);
                  this.snackBar.open('Accommodation updated but failed to upload images', 'Close', {
                    duration: 3000,
                  });
                  this.navigateBack();
                },
              });
          } else {
            this.isLoading = false;
            this.snackBar.open('Accommodation updated successfully', 'Close', { duration: 3000 });
            this.navigateBack();
          }
        },
        error: (error: Error) => {
          this.isLoading = false;
          console.error('Error updating accommodation:', error);
          this.snackBar.open('Failed to update accommodation', 'Close', { duration: 3000 });
        },
      });
    }
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
        error: (error: Error) => {
          console.error('Error deleting image:', error);
          this.snackBar.open('Failed to delete image', 'Close', { duration: 3000 });
        },
      });
  }

  public cancel(): void {
    this.navigateBack();
  }

  private navigateBack(): void {
    this.location.back();
  }

  private loadAccommodationData(): void {
    this.isLoading = true;
    const accommodationId = this.route.snapshot.paramMap.get('accommodationId');
    if (!accommodationId || accommodationId === 'new') {
      this.isNew = true;
      this.pageTitle = 'Add New Property';
      this.accommodationId = '';
      this.isLoading = false;
      return;
    }
    this.isNew = false;
    this.pageTitle = 'Edit Property';
    this.accommodationId = accommodationId;
    if (!this.currentUser || !this.currentUser.id) {
      this.isLoading = false;
      this.snackBar.open('User not authenticated', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }
    this.accommodationService
      .getLandlordAccommodations(this.currentUser.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (accommodations) => {
          const accommodation = accommodations.find((acc) => acc.id === accommodationId);
          if (accommodation) {
            this.updateFormWithAccommodation(accommodation);
            this.actualAccommodationImages = accommodation.imageUrls || [];
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.snackBar.open('Accommodation not found', 'Close', { duration: 3000 });
            this.navigateBack();
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error loading accommodation data:', error);
          this.snackBar.open(`Failed to load accommodations: ${error}`, 'Close', {
            duration: 3000,
          });
          this.navigateBack();
        },
      });
  }

  private updateFormWithAccommodation(accommodation: Accommodation): void {
    this.accommodationId = accommodation.id;
    this.accommodationOfferDate = accommodation.offerDate;
    this.accommodationForm.patchValue({
      title: accommodation.title,
      rentPrice: accommodation.rentPrice,
      description: accommodation.description,
      numBeds: accommodation.numBeds,
      numBathrooms: accommodation.numBathrooms,
      squareFootage: accommodation.squareFootage,
      availableFrom: accommodation.availableFrom,
      leaseDuration: accommodation.leaseDuration,
      floorNumber: accommodation.floorNumber || '',
      availabilityStatus: accommodation.availabilityStatus || 'Available',
      address: {
        placeName: accommodation.address?.placeName || '',
        apartmentNumber: accommodation.address?.apartmentNumber || '',
        location: accommodation.address?.location || [0, 0],
      },
      airConditioning: accommodation.airConditioning || false,
      dishwasher: accommodation.dishwasher || false,
      stainlessSteelAppliances: accommodation.stainlessSteelAppliances || false,
      patio: accommodation.patio || false,
      balcony: accommodation.balcony || false,
      refrigerator: accommodation.refrigerator || false,
      petsAllowed: accommodation.petsAllowed || false,
      smokingAllowed: accommodation.smokingAllowed || false,
      gym: accommodation.gym || false,
      parkingIncluded: accommodation.parkingIncluded || false,
      roommateAccepted: accommodation.roommateAccepted || false,
      furnished: accommodation.furnished || false,
      utilitiesIncluded: accommodation.utilitiesIncluded || false,
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      rentPrice: ['', Validators.required],
      description: ['', Validators.required],
      numBeds: ['', Validators.required],
      numBathrooms: ['', Validators.required],
      squareFootage: ['', Validators.required],
      availableFrom: ['', Validators.required],
      leaseDuration: ['', Validators.required],
      floorNumber: [''],
      availabilityStatus: ['Available', Validators.required],
      address: this.fb.group({
        placeName: ['', Validators.required],
        apartmentNumber: [''],
        location: [[0, 0], Validators.required],
      }),
      airConditioning: [false],
      dishwasher: [false],
      stainlessSteelAppliances: [false],
      patio: [false],
      balcony: [false],
      refrigerator: [false],
      petsAllowed: [false],
      smokingAllowed: [false],
      gym: [false],
      parkingIncluded: [false],
      roommateAccepted: [false],
      furnished: [false],
      utilitiesIncluded: [false],
    });
  }

  public isStepValid(step: number): boolean {
    switch (step) {
      case 0:
        return (
          !!this.accommodationForm.get('title')?.valid &&
          !!this.accommodationForm.get('rentPrice')?.valid
        );
      case 1:
        return (
          !!this.accommodationForm.get('description')?.valid &&
          !!this.accommodationForm.get('numBeds')?.valid &&
          !!this.accommodationForm.get('numBathrooms')?.valid &&
          !!this.accommodationForm.get('squareFootage')?.valid &&
          !!this.accommodationForm.get('availableFrom')?.valid &&
          !!this.accommodationForm.get('leaseDuration')?.valid
        );
      case 2:
        return true;
      case 3:
        return (
          !!this.accommodationForm.get('address.placeName')?.valid &&
          !!this.accommodationForm.get('address.location')?.valid
        );
      case 4:
        return true;
      default:
        return false;
    }
  }
}
