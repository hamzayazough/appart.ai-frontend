import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recommendation-circle',
  templateUrl: './recommendation-circle.component.html',
  styleUrl: './recommendation-circle.component.scss',
})
export class RecommendationCircleComponent {
  @Input() size = 100;
  @Input() stroke = 10;
  @Input() value = 50;

  getClass() {
    return this.value < 33 ? 'red' : this.value < 66 ? 'yellow' : 'green';
  }
}
