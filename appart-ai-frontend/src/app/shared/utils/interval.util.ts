import { interval, Observable, startWith, take, takeUntil, tap } from 'rxjs';

export class IntervalUtil {
  static setInterval(
    timeInterval: number,
    callback: () => void,
    takeUntil$: Observable<void>
  ): void {
    interval(timeInterval)
      .pipe(takeUntil(takeUntil$))
      .subscribe(() => {
        callback();
      });
  }
}
