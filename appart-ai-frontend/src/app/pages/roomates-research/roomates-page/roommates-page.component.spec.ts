import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoommatesPageComponent } from './roommates-page.component';

describe('RoommatesPageComponent', () => {
  let component: RoommatesPageComponent;
  let fixture: ComponentFixture<RoommatesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoommatesPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoommatesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
