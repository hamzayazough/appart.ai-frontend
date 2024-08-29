import { Component, Input } from '@angular/core';
import { IntervalUtil } from '../../utils/interval.util';
import { Subject } from 'rxjs';

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

  @Input() delayBetweenSwitches = 5000;

  protected activeImageIndex = 0;

  private destroyed$ = new Subject<void>();

  showPrevious(i: number) {
    this.activeImageIndex = (i - 1 + this.images.length) % this.images.length;
  }

  showNext(i: number) {
    this.activeImageIndex = (i + 1) % this.images.length;
  }

  startAutoSwitch() {
    if (this.delayBetweenSwitches > 0) {
      IntervalUtil.setInterval(
        this.delayBetweenSwitches,
        () => {
          this.showNext(this.activeImageIndex);
        },
        this.destroyed$
      );
    }
  }

  ngOnInit() {
    this.startAutoSwitch();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
