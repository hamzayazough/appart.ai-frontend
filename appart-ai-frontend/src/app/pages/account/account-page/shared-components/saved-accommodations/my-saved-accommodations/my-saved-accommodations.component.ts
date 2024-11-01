import { Component, Input, OnInit } from '@angular/core';
import { AccommodationBaseDTO } from '../../../../../../intefaces/accommodation.interface';
import { PrivateAccommodationService } from '../../../../../../services/private-accommodation-service/private-accommodation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-saved-accommodations',
  templateUrl: './my-saved-accommodations.component.html',
  styleUrl: './my-saved-accommodations.component.scss'
})
export class MySavedAccommodationsComponent implements OnInit {
  public savedAccommodations: AccommodationBaseDTO[] = [];
  private userId: string = "";

  constructor(private route: ActivatedRoute, private accommodationService: PrivateAccommodationService){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      const token: string | null = localStorage.getItem('token');
      if (token && this.userId) {
        this.accommodationService.getSavedAccommodations(this.userId, token).subscribe((accommodations: AccommodationBaseDTO[]) => {
          this.savedAccommodations = accommodations;
        });
      }
    });
  }

  removeAccommodation(accommodationId: string): void {
    const token: string | null = localStorage.getItem('token');
    if (token && this.userId) {
      this.accommodationService.removeSavedAccommodation(this.userId, accommodationId, token).subscribe(() => {
        // Mettre à jour la liste des hébergements sauvegardés localement après suppression
        this.savedAccommodations = this.savedAccommodations.filter(a => a.id !== accommodationId);
      });
    }
  }
}