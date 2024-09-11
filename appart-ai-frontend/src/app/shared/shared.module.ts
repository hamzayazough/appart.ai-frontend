import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSliderComponent } from './components/image-slider/image-slider.component';
import { GradientButtonComponent } from './components/gradient-button/gradient-button.component';
import { RecommendationCircleComponent } from './components/recommendation-circle/recommendation-circle.component';
import { MaterialModule } from '../material/material.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ImageSliderComponent,
    GradientButtonComponent,
    RecommendationCircleComponent,
  ],
  imports: [CommonModule, MaterialModule, MatProgressSpinnerModule],
  exports: [
    ImageSliderComponent,
    GradientButtonComponent,
    RecommendationCircleComponent,
  ],
})
export class SharedModule {}
