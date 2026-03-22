import { Component, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptimizeRequest } from '../../models/optimize-request';
import { OptimizeResponse } from '../../models/optimize-response';
import { ApiService } from '../../services/api.service';
import { Chart, registerables } from 'chart.js';
import { forkJoin, Observable } from 'rxjs';

Chart.register(...registerables);

interface ExperimentResult {
  execution: number;
  generations: number;
  distance: number;
  fitnessHistory: number[];
}

@Component({
  selector: 'app-experiments-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experiments-panel.component.html',
  styleUrl: './experiments-panel.component.scss'
})
export class ExperimentsPanelComponent implements OnDestroy {
  @Input() request: OptimizeRequest | null = null;
  @ViewChild('experimentsChart') chartCanvas!: ElementRef<HTMLCanvasElement>;

  experiments: ExperimentResult[] = [];
  isLoading = false;
  hasRun = false;
  private chart: Chart | null = null;

  constructor(private apiService: ApiService) {}

  runExperiments() {
    if (!this.request) return;

    this.isLoading = true;
    this.hasRun = false;
    this.experiments = [];

    const scenarios = [50, 100, 200];
    const basePoints = this.request.points;
    const baseVehicles = this.request.vehicles || 1;
    const baseSpeed = this.request.speed_kmh;

    const requests: Observable<OptimizeResponse>[] = scenarios.map(gen => {
      const req: OptimizeRequest = {
        points: basePoints,
        generations: gen,
        vehicles: baseVehicles,
        speed_kmh: baseSpeed
      };
      return this.apiService.optimize(req);
    });

    // Run parallel
    forkJoin(requests).subscribe({
      next: (responses) => {
        this.experiments = responses.map((res, index) => ({
          execution: index + 1,
          generations: scenarios[index],
          distance: res.total_distance,
          fitnessHistory: res.fitness_history
        }));
        this.isLoading = false;
        this.hasRun = true;
        setTimeout(() => this.updateChart());
      },
      error: (err) => {
        console.error('Experimento falhou', err);
        this.isLoading = false;
      }
    });
  }

  private updateChart() {
    if (!this.chartCanvas?.nativeElement) return;
    if (this.chart) {
      this.chart.destroy();
    }

    // Find max length of fitness history to align X axis
    const maxGen = Math.max(...this.experiments.map(e => e.fitnessHistory.length));
    const labels = Array.from({ length: maxGen }, (_, i) => i + 1);

    const colors = [
      'rgb(75, 192, 192)',
      'rgb(255, 99, 132)',
      'rgb(153, 102, 255)'
    ];

    const datasets = this.experiments.map((exp, index) => ({
      label: `Execução ${exp.execution} (${exp.generations} ger)`,
      data: exp.fitnessHistory,
      borderColor: colors[index % colors.length],
      borderWidth: 2,
      fill: false,
      tension: 0.1
    }));

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'Evolução por Cenário' }
        },
        scales: {
          x: { title: { display: true, text: 'Geração' } },
          y: { title: { display: true, text: 'Fitness (Custo)' } }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
