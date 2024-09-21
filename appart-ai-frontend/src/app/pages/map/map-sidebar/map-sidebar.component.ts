import { Component, Input } from '@angular/core';
import { Apartment } from '../../../shared/types/apartment';
import { AccommodationsService } from '../../../services/accomodations/accomodations.service';
import { Recommendation } from '../../../shared/types/recommendation';
import { AccommodationMatchingDTO } from '../../../intefaces/accommodation.interface';
@Component({
  selector: 'app-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrl: './map-sidebar.component.scss',
})
export class MapSidebarComponent {
  constructor(public accommodationService: AccommodationsService) {}
  @Input() data: AccommodationMatchingDTO[] = [];
  @Input() opened: boolean = true;
}
