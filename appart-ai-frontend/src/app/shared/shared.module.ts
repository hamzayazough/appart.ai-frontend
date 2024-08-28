import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { GradientButtonComponent } from './gradient-button/gradient-button.component';

@NgModule({
  declarations: [ImageSliderComponent, GradientButtonComponent],
  imports: [CommonModule],
  exports: [ImageSliderComponent, GradientButtonComponent],
})
export class SharedModule {}
