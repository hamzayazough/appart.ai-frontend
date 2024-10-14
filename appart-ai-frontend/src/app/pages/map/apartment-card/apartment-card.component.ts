import { Component, Input } from '@angular/core';
import { AccommodationMatchingDTO } from '../../../intefaces/accommodation.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apartment-card',
  templateUrl: './apartment-card.component.html',
  styleUrl: './apartment-card.component.scss',
})
export class ApartmentCardComponent {
  @Input() data: AccommodationMatchingDTO = {} as AccommodationMatchingDTO;

  constructor(private route: Router) {}

  public selectAccommodation() {
    this.route.navigate([`accommodation/${this.data.value.id}`]);
  }
}
