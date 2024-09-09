import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountHobbiesComponent } from './account-hobbies.component';

describe('AccountHobbiesComponent', () => {
  let component: AccountHobbiesComponent;
  let fixture: ComponentFixture<AccountHobbiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountHobbiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountHobbiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
