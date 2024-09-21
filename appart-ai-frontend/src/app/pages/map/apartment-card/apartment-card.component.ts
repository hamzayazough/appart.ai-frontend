import { Component, Input } from '@angular/core';
import { AccommodationMatchingDTO } from '../../../intefaces/accommodation.interface';

@Component({
  selector: 'app-apartment-card',
  templateUrl: './apartment-card.component.html',
  styleUrl: './apartment-card.component.scss',
})
export class ApartmentCardComponent {
  @Input() data: AccommodationMatchingDTO = {} as AccommodationMatchingDTO;
}
