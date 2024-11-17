import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomatesPageComponent } from './roomates-page.component';

describe('RoomatesPageComponent', () => {
  let component: RoomatesPageComponent;
  let fixture: ComponentFixture<RoomatesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomatesPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomatesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
