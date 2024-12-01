import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceMapComponent } from './preference-map.component';

describe('PreferenceMapComponent', () => {
  let component: PreferenceMapComponent;
  let fixture: ComponentFixture<PreferenceMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreferenceMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreferenceMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
