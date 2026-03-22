import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OptimizeRequest } from '../../models/optimize-request';

@Component({
  selector: 'app-config-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config-panel.component.html',
  styleUrl: './config-panel.component.scss'
})
export class ConfigPanelComponent {
  points: number = 20;
  generations: number = 100;
  vehicles: number = 1;
  speed_kmh: number = 60;
  max_capacity: number = 100;
  max_distance: number = 300;

  @Output() optimize = new EventEmitter<OptimizeRequest>();

  onSubmit() {
    this.optimize.emit({
      points: this.points,
      generations: this.generations,
      vehicles: this.vehicles,
      speed_kmh: this.speed_kmh,
      max_capacity: this.max_capacity,
      max_distance: this.max_distance
    });
  }
}
