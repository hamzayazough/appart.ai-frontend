import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccommodationManagingService } from '../../../../services/accommodation-managing/accommodation-managing.service';
import { Accommodation } from '../../../../intefaces/accommodation.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-accommodation-creation-dialog',
  templateUrl: './accommodation-creation-dialog.component.html',
  styleUrl: './accommodation-creation-dialog.component.scss'
})
export class AccommodationCreationDialogComponent {
  accommodationForm: FormGroup;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AccommodationCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, private accommodationService: AccommodationManagingService, private snackBar: MatSnackBar
  ) {
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
        placeName: ['', Validators.required],
        apartmentNumber: [''],
        location: ['', Validators.required]
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
      utilitiesIncluded: [data.accommodation?.utilitiesIncluded || false]
    });
  }

  onAddressSelected(address: any): void {
    this.accommodationForm.patchValue({
      address: {
        placeName: address.placeName,
        apartmentNumber: address.apartmentNumber,
        location: address.location
      }
    });
  }

  onFileSelected(event: any): void {
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

  removeImage(imagePreview: string): void {
    const index = this.imagePreviews.indexOf(imagePreview);
    if (index > -1) {
      this.imagePreviews.splice(index, 1);
      this.selectedFiles.splice(index, 1);
    }
  }
  save(): void {
    if (this.accommodationForm.valid) {
      const accommodation = this.accommodationForm.value;
      const userId: string = localStorage.getItem('userId') || '';

      const token: string | null = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      this.accommodationService.addAccommodation(accommodation, this.selectedFiles, token).subscribe(
        (accommodation: Accommodation) => {
          this.snackBar.open('Accommodation created successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(accommodation);
        },
        (error) => {
          console.error('Error creating accommodation:', error);
          this.snackBar.open('Failed to create accommodation', 'Close', { duration: 3000 });
        }
      );
    }
  }
  

  cancel(): void {
    this.dialogRef.close();
  }
}
