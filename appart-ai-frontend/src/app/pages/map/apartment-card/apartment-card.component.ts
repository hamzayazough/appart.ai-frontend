import { Component, Input } from '@angular/core';
import { Apartment } from '../../../shared/types/apartment';

@Component({
  selector: 'app-apartment-card',
  templateUrl: './apartment-card.component.html',
  styleUrl: './apartment-card.component.scss',
})
export class ApartmentCardComponent {
  @Input() apartment: Apartment | undefined = undefined;
}
