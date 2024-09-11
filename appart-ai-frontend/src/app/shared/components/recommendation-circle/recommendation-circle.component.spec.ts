import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationCircleComponent } from './recommendation-circle.component';

describe('RecommendationCircleComponent', () => {
  let component: RecommendationCircleComponent;
  let fixture: ComponentFixture<RecommendationCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecommendationCircleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecommendationCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
