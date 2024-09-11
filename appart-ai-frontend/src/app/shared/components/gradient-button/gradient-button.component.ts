import { Component, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-gradient-button',
  templateUrl: './gradient-button.component.html',
  styleUrl: './gradient-button.component.scss',
})
export class GradientButtonComponent {
  @Input() message: string = 'Se connecter';
  @Input() styleOnHover = false;
  @Input() height = 50;
  @Input() width = 100;

  constructor(@Inject(DOCUMENT) public document: Document) {}
}
