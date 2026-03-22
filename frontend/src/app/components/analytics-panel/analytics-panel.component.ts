import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptimizeResponse } from '../../models/optimize-response';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-panel.component.html',
  styleUrl: './analytics-panel.component.scss'
})
export class AnalyticsPanelComponent implements OnChanges {
  @Input() result: OptimizeResponse | null = null;
  @ViewChild('analyticsChart') chartCanvas!: ElementRef<HTMLCanvasElement>;

  bestFitness = 0;
  avgFitness = 0;
  improvementPercent = 0;
  insightText = '';

  private chart: Chart | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['result'] && this.result) {
      this.calculateMetrics();
      setTimeout(() => this.updateChart());
    }
  }

  private calculateMetrics() {
    if (!this.result || !this.result.fitness_history.length) return;

    const history = this.result.fitness_history;
    const initialFitness = history[0];
    this.bestFitness = history[history.length - 1];
    
    const sum = history.reduce((a, b) => a + b, 0);
    this.avgFitness = sum / history.length;

    this.improvementPercent = ((initialFitness - this.bestFitness) / initialFitness) * 100;

    this.insightText = `O algoritmo reduziu o custo inicial de ${initialFitness.toFixed(2)} km para ${this.bestFitness.toFixed(2)} km, representando uma melhoria de ${this.improvementPercent.toFixed(1)}% ao longo das ${history.length} gerações.`;
  }

  private updateChart() {
    if (!this.chartCanvas?.nativeElement || !this.result) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const history = this.result.fitness_history;
    const labels = history.map((_, i) => i + 1);

    // Média array to draw a straight line
    const avgData = new Array(history.length).fill(this.avgFitness);

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Evolução do Custo (Fitness)',
            data: history,
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            fill: true,
            tension: 0.1
          },
          {
            label: 'Média de Custo',
            data: avgData,
            borderColor: '#ffc107',
            borderDash: [5, 5],
            borderWidth: 2,
            fill: false,
            tension: 0,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'Análise de Convergência' }
        },
        scales: {
          x: {
            title: { display: true, text: 'Geração' }
          },
          y: {
            title: { display: true, text: 'Fitness (Custo)' }
          }
        }
      }
    });
  }
}
