import { Component, Input } from '@angular/core';
import { AccommodationMatchingDTO } from '../../../intefaces/accommodation.interface';
@Component({
  selector: 'app-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrl: './map-sidebar.component.scss',
})
export class MapSidebarComponent {
  constructor() {
  }
  @Input() data: AccommodationMatchingDTO[] = [];
  @Input() opened: boolean = true;
  @Input() matchingFeature: boolean = false;
}

