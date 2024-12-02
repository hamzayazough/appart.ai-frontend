import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationMapComponent } from './accommodation-map.component';

describe('AccommodationMapComponent', () => {
  let component: AccommodationMapComponent;
  let fixture: ComponentFixture<AccommodationMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccommodationMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccommodationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
