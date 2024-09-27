import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationManagementPageComponent } from './accommodation-management-page.component';

describe('AccommodationManagementPageComponent', () => {
  let component: AccommodationManagementPageComponent;
  let fixture: ComponentFixture<AccommodationManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccommodationManagementPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccommodationManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
