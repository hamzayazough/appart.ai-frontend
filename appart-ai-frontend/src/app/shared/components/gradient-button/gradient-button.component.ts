import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gradient-button',
  templateUrl: './gradient-button.component.html',
  styleUrl: './gradient-button.component.scss',
})
export class GradientButtonComponent {
  @Input() styleOnHover = false;
  @Input() height = 50;
  @Input() width = 100;
}
