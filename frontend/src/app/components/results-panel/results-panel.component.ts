import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptimizeResponse } from '../../models/optimize-response';

@Component({
  selector: 'app-results-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-panel.component.html',
  styleUrl: './results-panel.component.scss'
})
export class ResultsPanelComponent implements OnChanges {
  @Input() result: OptimizeResponse | null = null;
  
  numVehicles: number = 0;
  initialFitness: number = 0;
  finalFitness: number = 0;
  totalImprovement: number = 0;
  improvementPercent: number = 0;

  ngOnChanges(): void {
    if (this.result) {
      if (this.result.routes) {
        this.numVehicles = this.result.routes.filter(r => r.length > 0).length;
      } else {
        this.numVehicles = 0;
      }

      if (this.result.fitness_history && this.result.fitness_history.length > 0) {
        this.initialFitness = this.result.fitness_history[0];
        this.finalFitness = this.result.fitness_history[this.result.fitness_history.length - 1];
        this.totalImprovement = this.initialFitness - this.finalFitness;
        this.improvementPercent = this.initialFitness > 0 
          ? (this.totalImprovement / this.initialFitness) * 100 
          : 0;
      } else {
        this.initialFitness = 0;
        this.finalFitness = 0;
        this.totalImprovement = 0;
        this.improvementPercent = 0;
      }
    } else {
      this.numVehicles = 0;
      this.initialFitness = 0;
      this.finalFitness = 0;
      this.totalImprovement = 0;
      this.improvementPercent = 0;
    }
  }
}

