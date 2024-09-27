import { Component, Input } from '@angular/core';
import { IntervalUtil } from '../../utils/interval.util';
import { race, Subject, take, takeUntil, timer } from 'rxjs';
import { Image } from '../../../intefaces/image.interface';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.scss',
})
export class ImageSliderComponent {
  @Input() images: Image[] = [];
  @Input() delayBetweenSwitches = 0;
  @Input() height = 600;
  @Input() width = 1200;

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
      .pipe(take(1), takeUntil(race(this.stopAutoSwitch$, this.destroyed$)))
      .subscribe(() => {
        this.startAutoSwitch();
      });
  }

  ngOnInit() {
    console.log('images', this.images);
    this.images.forEach((image, index) => {
      console.log('image', image.src);
      console.log('index', index);
    });
    this.startAutoSwitch();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
