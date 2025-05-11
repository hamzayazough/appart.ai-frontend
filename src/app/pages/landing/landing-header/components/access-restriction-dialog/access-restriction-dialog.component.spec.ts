import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRestrictionDialogComponent } from './access-restriction-dialog.component';

describe('AccessRestrictionDialogComponent', () => {
  let component: AccessRestrictionDialogComponent;
  let fixture: ComponentFixture<AccessRestrictionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccessRestrictionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessRestrictionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
