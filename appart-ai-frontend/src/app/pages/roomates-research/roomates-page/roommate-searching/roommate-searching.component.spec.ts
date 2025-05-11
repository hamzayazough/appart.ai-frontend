import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoommateSearchingComponent } from './roommate-searching.component';

describe('RoommateSearchingComponent', () => {
  let component: RoommateSearchingComponent;
  let fixture: ComponentFixture<RoommateSearchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoommateSearchingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoommateSearchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
