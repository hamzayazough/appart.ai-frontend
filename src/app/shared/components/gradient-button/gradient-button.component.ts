import { Component, Input, Inject, Output, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EventEmitter } from 'node:stream';

@Component({
  selector: 'app-gradient-button',
  templateUrl: './gradient-button.component.html',
  styleUrl: './gradient-button.component.scss',
})
export class GradientButtonComponent {
  @Input() message = 'Se connecter';
  @Input() styleOnHover = false;
  @Input() height = 50;
  @Input() width = 100;

  constructor(@Inject(DOCUMENT) public document: Document) {}
}
