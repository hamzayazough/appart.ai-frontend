import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationCreationDialogComponent } from './accommodation-creation-dialog.component';

describe('AccommodationCreationDialogComponent', () => {
  let component: AccommodationCreationDialogComponent;
  let fixture: ComponentFixture<AccommodationCreationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccommodationCreationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccommodationCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
