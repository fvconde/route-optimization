import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
import { ResultsPanelComponent } from './components/results-panel/results-panel.component';
import { ChartComponent } from './components/chart/chart.component';
import { MapComponent } from './components/map/map.component';
import { ApiService } from './services/api.service';
import { OptimizeRequest } from './models/optimize-request';
import { OptimizeResponse } from './models/optimize-response';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ConfigPanelComponent,
    ResultsPanelComponent,
    ChartComponent,
    MapComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  result: OptimizeResponse | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  onOptimize(request: OptimizeRequest) {
    this.isLoading = true;
    this.error = null;
    
    this.apiService.optimize(request).subscribe({
      next: (res) => {
        this.result = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Optimization error:', err);
        this.error = 'Ocorreu um erro ao otimizar a rota. Tente novamente.';
        this.isLoading = false;
      }
    });
  }
}
