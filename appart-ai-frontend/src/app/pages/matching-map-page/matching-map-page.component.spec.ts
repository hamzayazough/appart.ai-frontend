import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingMapPageComponent } from './matching-map-page.component';

describe('MatchingMapPageComponent', () => {
  let component: MatchingMapPageComponent;
  let fixture: ComponentFixture<MatchingMapPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatchingMapPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchingMapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
