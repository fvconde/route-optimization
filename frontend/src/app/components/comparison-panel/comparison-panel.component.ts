import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
import { OptimizeRequest } from '../../models/optimize-request';
import { OptimizeResponse, Point } from '../../models/optimize-response';

interface ComparisonResult {
  algorithm: string;
  distance: number;
  time: number;
}

@Component({
  selector: 'app-comparison-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comparison-panel.component.html',
  styleUrl: './comparison-panel.component.scss'
})
export class ComparisonPanelComponent implements OnChanges {
  @Input() request: OptimizeRequest | null = null;
  @Input() result: OptimizeResponse | null = null;
  @ViewChild('comparisonChart') chartCanvas!: ElementRef<HTMLCanvasElement>;

  results: ComparisonResult[] = [];
  hasRun = false;
  private chart: Chart | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['result']) {
      this.hasRun = false;
      this.results = [];
    }
  }

  runComparison() {
    if (!this.request || !this.result || !this.result.points.length) return;

    const points = this.result.points;
    const speed = this.request.speed_kmh;

    // 1. Genetic Algorithm (Already calculated)
    const gaResult: ComparisonResult = {
      algorithm: 'Genético',
      distance: this.result.total_distance,
      time: this.result.estimated_time_h
    };

    // 2. Random Route
    const randomRoutePoints = this.shuffleArray([...points]);
    const randomDistance = this.calculateTotalDistance(randomRoutePoints);
    const randomTime = randomDistance / speed;
    const randomResult: ComparisonResult = {
      algorithm: 'Aleatório',
      distance: randomDistance,
      time: randomTime
    };

    // 3. Nearest Neighbor Heuristic
    const nnDist = this.calculateNearestNeighborDistance(points);
    const nnTime = nnDist / speed;
    const nnResult: ComparisonResult = {
      algorithm: 'Vizinho Mais Próximo',
      distance: nnDist,
      time: nnTime
    };

    this.results = [gaResult, randomResult, nnResult];
    this.hasRun = true;
    
    setTimeout(() => this.updateChart());
  }

  private updateChart() {
    if (!this.chartCanvas?.nativeElement) return;
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.results.map(r => r.algorithm);
    const data = this.results.map(r => r.distance);

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Distância Total (km)',
          data: data,
          backgroundColor: [
            'rgba(0, 123, 255, 0.6)',
            'rgba(220, 53, 69, 0.6)',
            'rgba(255, 193, 7, 0.6)'
          ],
          borderColor: [
            'rgb(0, 123, 255)',
            'rgb(220, 53, 69)',
            'rgb(255, 193, 7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Comparação de Distância' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  private shuffleArray(array: Point[]): Point[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private calculateDistance(p1: Point, p2: Point): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private calculateTotalDistance(route: Point[]): number {
    let d = 0;
    for (let i = 0; i < route.length - 1; i++) {
        d += this.calculateDistance(route[i], route[i+1]);
    }
    // Return to start
    if (route.length > 1) {
        d += this.calculateDistance(route[route.length - 1], route[0]);
    }
    return d;
  }

  private calculateNearestNeighborDistance(points: Point[]): number {
    if (!points.length) return 0;
    
    // Clone and remove first point (start)
    const unvisited = [...points];
    const current = unvisited.shift()!;
    let totalDist = 0;
    let currNode = current;

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minD = Infinity;
      
      for (let i = 0; i < unvisited.length; i++) {
        const d = this.calculateDistance(currNode, unvisited[i]);
        if (d < minD) {
          minD = d;
          nearestIdx = i;
        }
      }
      
      totalDist += minD;
      currNode = unvisited[nearestIdx];
      unvisited.splice(nearestIdx, 1);
    }
    
    // Return to start
    totalDist += this.calculateDistance(currNode, current);
    return totalDist;
  }
}
