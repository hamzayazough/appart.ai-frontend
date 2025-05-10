import { Component, OnInit } from '@angular/core';
import { AccommodationBaseDTO } from '../../../../../../intefaces/accommodation.interface';
import { UserRelatedAccommodationsService } from '../../../../../../services/private-accommodation-service/user-related-accommodations.service';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { DialogService } from '../../../../../../services/dialog-service/dialog.service';

@Component({
  selector: 'app-my-saved-accommodations',
  templateUrl: './my-saved-accommodations.component.html',
  styleUrl: './my-saved-accommodations.component.scss',
})
export class MySavedAccommodationsComponent implements OnInit {
  public savedAccommodations: AccommodationBaseDTO[] = [];
  private userId = '';

  constructor(
    private route: ActivatedRoute,
    private accommodationService: UserRelatedAccommodationsService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.userId = params['id'];
          if (!this.userId) {
            this.dialogService.showWarning(
              'User ID not found. Please check your login status and try again.',
              'Authentication Error'
            );
            return of([]);
          }
          return this.accommodationService.getSavedAccommodations(this.userId);
        })
      )
      .subscribe({
        next: (accommodations) => {
          this.savedAccommodations = accommodations;

          if (accommodations.length === 0) {
            this.dialogService.showInfo(
              'You have no saved accommodations yet.',
              'Saved Accommodations'
            );
          }
        },
        error: (err) => {
          console.error('Error fetching saved accommodations:', err);
          this.dialogService.showError(
            'Failed to load saved accommodations. Please try again later.',
            'Loading Error'
          );
        },
      });
  }

  removeAccommodation(accommodationId: string): void {
    this.dialogService
      .showConfirmation(
        'Are you sure you want to remove this saved accommodation?',
        'Remove Accommodation',
        'Remove',
        'Cancel'
      )
      .subscribe((confirmed) => {
        if (confirmed && this.userId) {
          this.accommodationService
            .removeSavedAccommodation(this.userId, accommodationId)
            .subscribe({
              next: () => {
                this.savedAccommodations = this.savedAccommodations.filter(
                  (a) => a.id !== accommodationId
                );
                this.dialogService.showSuccess(
                  'Accommodation removed from your saved list.',
                  'Removed Successfully',
                  'OK',
                  true
                );
              },
              error: (err) => {
                console.error('Error removing accommodation:', err);
                this.dialogService.showError(
                  'Failed to remove accommodation. Please try again.',
                  'Removal Error'
                );
              },
            });
        }
      });
  }
}
