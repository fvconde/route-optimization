import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnChanges {
  @Input() fitnessHistory: number[] = [];
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: Chart | null = null;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fitnessHistory'] && this.fitnessHistory) {
      if (this.chartCanvas) {
        this.updateChart();
      } else {
        setTimeout(() => this.updateChart());
      }
    }
  }

  private updateChart() {
    if (!this.chartCanvas?.nativeElement) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.fitnessHistory.map((_, i) => i + 1);

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Evolução do Fitness',
          data: this.fitnessHistory,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Geração'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Fitness (Distância Menor é Melhor)'
            }
          }
        }
      }
    });
  }
}
