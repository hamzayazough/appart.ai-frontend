import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoommateRequestComponent } from './create-roommate-request.component';

describe('CreateRoommateRequestComponent', () => {
  let component: CreateRoommateRequestComponent;
  let fixture: ComponentFixture<CreateRoommateRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateRoommateRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRoommateRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
