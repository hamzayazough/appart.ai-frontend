import { Component, Input } from '@angular/core';

export interface Image {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.scss',
})
export class ImageSliderComponent {
  @Input() images: Image[] = [];

  protected activeImageIndex = 0;

  showPrevious(i: number) {
    this.activeImageIndex = (i - 1 + this.images.length) % this.images.length;
  }

  showNext(i: number) {
    this.activeImageIndex = (i + 1) % this.images.length;
  }
}
