import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySavedAccommodationsComponent } from './my-saved-accommodations.component';

describe('MySavedAccommodationsComponent', () => {
  let component: MySavedAccommodationsComponent;
  let fixture: ComponentFixture<MySavedAccommodationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MySavedAccommodationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MySavedAccommodationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
