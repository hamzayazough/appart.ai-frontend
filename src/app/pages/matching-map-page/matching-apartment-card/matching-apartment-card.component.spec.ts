import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingApartmentCardComponent } from './matching-apartment-card.component';

describe('MatchingApartmentCardComponent', () => {
  let component: MatchingApartmentCardComponent;
  let fixture: ComponentFixture<MatchingApartmentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatchingApartmentCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchingApartmentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
