import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSliderComponent } from './components/image-slider/image-slider.component';
import { GradientButtonComponent } from './components/gradient-button/gradient-button.component';
import { RecommendationCircleComponent } from './components/recommendation-circle/recommendation-circle.component';
import { MaterialModule } from '../material/material.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { LandingHeaderComponent } from '../pages/landing/landing-header/landing-header.component';
import { AuthButtonComponent } from '../pages/landing/landing-header/components/auth-button/auth-button.component';

@NgModule({
  declarations: [
    ImageSliderComponent,
    GradientButtonComponent,
    RecommendationCircleComponent,
    ConfirmationDialogComponent,
    LandingHeaderComponent,
    AuthButtonComponent,
  ],
  imports: [CommonModule, MaterialModule, MatProgressSpinnerModule],
  exports: [
    ImageSliderComponent,
    GradientButtonComponent,
    RecommendationCircleComponent,
    LandingHeaderComponent,
    AuthButtonComponent,
  ],
})
export class SharedModule {}
