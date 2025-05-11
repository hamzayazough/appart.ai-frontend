import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Accommodation } from '../../intefaces/accommodation.interface';

@Injectable({
  providedIn: 'root',
})
export class AccommodationStateService {
  private accommodationSubject = new BehaviorSubject<Accommodation | null>(null);
  public accommodation$ = this.accommodationSubject.asObservable();

  setCurrentAccommodation(accommodation: Accommodation | null): void {
    this.accommodationSubject.next(accommodation);
  }

  getCurrentAccommodation(): Observable<Accommodation | null> {
    return this.accommodation$;
  }

  clearCurrentAccommodation(): void {
    this.accommodationSubject.next(null);
  }
}
