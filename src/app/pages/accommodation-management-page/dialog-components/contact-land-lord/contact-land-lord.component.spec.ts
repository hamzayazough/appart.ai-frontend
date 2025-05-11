import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactLandLordComponent } from './contact-land-lord.component';

describe('ContactLandLordComponent', () => {
  let component: ContactLandLordComponent;
  let fixture: ComponentFixture<ContactLandLordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactLandLordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactLandLordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
