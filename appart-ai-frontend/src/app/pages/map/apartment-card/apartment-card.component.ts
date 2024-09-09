import { Component, Input } from '@angular/core';
import { Apartment } from '../../../shared/types/apartment';
import { AccommodationsService } from '../../../services/accomodations/accomodations.service';

@Component({
  selector: 'app-apartment-card',
  templateUrl: './apartment-card.component.html',
  styleUrl: './apartment-card.component.scss',
})
export class ApartmentCardComponent {
  @Input() data: Apartment | undefined;
}
