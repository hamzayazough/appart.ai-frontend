import { Component, Input, OnInit } from '@angular/core';
import { AccommodationMatchingDTO } from '../../../intefaces/accommodation.interface';
import { Router } from '@angular/router';
import { Image, ImageUrl } from '../../../intefaces/image.interface';

@Component({
  selector: 'app-matching-apartment-card',
  templateUrl: './matching-apartment-card.component.html',
  styleUrl: './matching-apartment-card.component.scss',
})
export class MatchingApartmentCardComponent implements OnInit {
  @Input() data: AccommodationMatchingDTO = {} as AccommodationMatchingDTO;
  images: Image[] = [];
  currentImageIndex = 0;

  constructor(private route: Router) {}
  ngOnInit() {
    this.images = this.toImage(this.data.accommodation.imageUrls || []);

    if (this.images.length === 0) {
      this.images.push({
        src: '/assets/images/placeholder.jpg',
        alt: 'No image available',
      });
    }
  }

  get currentImage(): Image {
    return this.images[this.currentImageIndex];
  }

  prevImage(event: Event) {
    event.stopPropagation();
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  nextImage(event: Event) {
    event.stopPropagation();
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }
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
    const score = this.data.matching.score?.total || 0;
    return Math.round(score * 100);
  }

  public toImage(images: ImageUrl[]): Image[] {
    return images.map((image) => ({
      alt: image.imageAlt,
      src: image.imageUrl,
    }));
  }

  public getDistanceText(distance: number): string {
    if (distance >= 0.85) {
      return 'Very close to your locations';
    } else if (distance > 0.6) {
      return 'Reasonable distance';
    } else {
      return 'Far from your locations';
    }
  }
}
