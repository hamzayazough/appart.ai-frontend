import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoommateRequestComponent } from './edit-roommate-request.component';

describe('EditRoommateRequestComponent', () => {
  let component: EditRoommateRequestComponent;
  let fixture: ComponentFixture<EditRoommateRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditRoommateRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRoommateRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
