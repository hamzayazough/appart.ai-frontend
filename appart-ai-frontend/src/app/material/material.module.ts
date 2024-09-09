import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';

const modules = [MatTabsModule, MatSliderModule];
@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class MaterialModule {}
