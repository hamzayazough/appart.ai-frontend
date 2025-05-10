import { Component, Input, OnChanges, SimpleChanges, OnInit } from "@angular/core"

@Component({
  selector: "app-recommendation-circle",
  templateUrl: "./recommendation-circle.component.html",
  styleUrl: "./recommendation-circle.component.scss",
})
export class RecommendationCircleComponent implements OnChanges, OnInit {
  @Input() size = 100
  @Input() stroke = 10
  @Input() value = 50

  radius = 0
  circumference = 0
  dashoffset = 0
  viewBox = ""

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["size"] || changes["stroke"] || changes["value"]) {
      this.calculateCircleProperties();
    }
  }

  ngOnInit() {
    this.calculateCircleProperties();
  }

  private calculateCircleProperties() {
    this.radius = (this.size - this.stroke) / 2;
    this.circumference = this.radius * 2 * Math.PI;
    this.dashoffset = this.circumference * (1 - this.value / 100);
    this.viewBox = `0 0 ${this.size} ${this.size}`;
  }

  getClass() {
    if (this.value < 33) {
      return "red";
    } else if (this.value < 66) {
      return "yellow";
    } else {
      return "green";
    }
  }
}
