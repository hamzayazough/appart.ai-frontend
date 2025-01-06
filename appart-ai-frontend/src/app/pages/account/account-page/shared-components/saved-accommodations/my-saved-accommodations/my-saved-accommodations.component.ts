import { Component, Input, OnInit } from '@angular/core';
import { AccommodationBaseDTO } from '../../../../../../intefaces/accommodation.interface';
import { PrivateAccommodationService } from '../../../../../../services/private-accommodation-service/private-accommodation.service';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from '../../../../../../services/token-service/token.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-my-saved-accommodations',
  templateUrl: './my-saved-accommodations.component.html',
  styleUrl: './my-saved-accommodations.component.scss'
})
export class MySavedAccommodationsComponent implements OnInit {
  public savedAccommodations: AccommodationBaseDTO[] = [];
  private userId: string = '';

  constructor(
    private route: ActivatedRoute,
    private accommodationService: PrivateAccommodationService,
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.userId = params['id'];
          return this.userId ? this.accommodationService.getSavedAccommodations(this.userId) : of([]);
        })
      )
      .subscribe({
        next: (accommodations) => (this.savedAccommodations = accommodations),
        error: (err) => {
          console.error('Error fetching saved accommodations:', err);
          alert('Failed to load saved accommodations. Please try again later.');
        },
      });
  }
  
  removeAccommodation(accommodationId: string): void {
      if (this.userId) {
        this.accommodationService.removeSavedAccommodation(this.userId, accommodationId).subscribe({
          next: () => {
            this.savedAccommodations = this.savedAccommodations.filter((a) => a.id !== accommodationId);
            alert('Accommodation removed successfully.');
          },
          error: (err) => {
            console.error('Error removing accommodation:', err);
            alert('Failed to remove accommodation. Please try again.');
          },
        });
      };
  }
}