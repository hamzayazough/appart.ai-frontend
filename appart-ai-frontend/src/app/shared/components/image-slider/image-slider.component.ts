import { Component, Input } from '@angular/core';
import { IntervalUtil } from '../../utils/interval.util';
import { race, Subject, take, takeUntil, timer } from 'rxjs';

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

  @Input() delayBetweenSwitches = 0;

  protected activeImageIndex = 0;

  private destroyed$ = new Subject<void>();

  private stopAutoSwitch$ = new Subject<void>();

  showPrevious(i: number) {
    this.activeImageIndex = (i - 1 + this.images.length) % this.images.length;
  }

  showNext(i: number) {
    this.activeImageIndex = (i + 1) % this.images.length;
  }

  private startAutoSwitch() {
    if (this.delayBetweenSwitches > 0) {
      IntervalUtil.setInterval(
        this.delayBetweenSwitches,
        () => {
          this.showNext(this.activeImageIndex);
        },
        race(this.stopAutoSwitch$, this.destroyed$)
      );
    }
  }

  protected stopAutoSwitch() {
    this.stopAutoSwitch$.next();
    timer(this.delayBetweenSwitches * 10)
      .pipe(take(1), takeUntil(this.destroyed$))
      .subscribe(() => {
        this.startAutoSwitch();
      });
  }

  ngOnInit() {
    this.startAutoSwitch();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
