import { Component, Input } from '@angular/core';
import { AccommodationMatchingDTO } from '../../../intefaces/accommodation.interface';
import { Router } from '@angular/router';
import { Image, ImageUrl } from '../../../intefaces/image.interface';

@Component({
  selector: 'app-apartment-card',
  templateUrl: './apartment-card.component.html',
  styleUrl: './apartment-card.component.scss',
})
export class ApartmentCardComponent {
  @Input() data: AccommodationMatchingDTO = {} as AccommodationMatchingDTO;

  constructor(private route: Router) {}

  public selectAccommodation() {
    this.route.navigate([`accommodation/${this.data.accommodation.id}`]);
  }

  public get pros(): string[] {
    return this.data.matching.pros || [];
  }

  public get cons(): string[] {
    return this.data.matching.cons || [];
  }

  public get formattedScore(): number {
    return this.data.matching.score?.total || 0;
  }

  public toImage(images: ImageUrl[]): Image[] {
    return images.map((image) => ({
      alt: image.imageAlt,
      src: image.imageUrl,
    }));
  }
  
}
