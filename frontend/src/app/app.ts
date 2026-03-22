import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
import { ResultsPanelComponent } from './components/results-panel/results-panel.component';
import { ChartComponent } from './components/chart/chart.component';
import { MapComponent } from './components/map/map.component';
import { ComparisonPanelComponent } from './components/comparison-panel/comparison-panel.component';
import { ExperimentsPanelComponent } from './components/experiments-panel/experiments-panel.component';
import { AnalyticsPanelComponent } from './components/analytics-panel/analytics-panel.component';
import { ReportPanelComponent } from './components/report-panel/report-panel.component';
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
    MapComponent,
    ComparisonPanelComponent,
    ExperimentsPanelComponent,
    AnalyticsPanelComponent,
    ReportPanelComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  result: OptimizeResponse | null = null;
  lastRequest: OptimizeRequest | null = null;
  isLoading = false;
  error: string | null = null;
  activeTab: 'resultado' | 'comparacao' | 'experimentos' | 'analise' | 'relatorio' = 'resultado';

  constructor(private apiService: ApiService) {}

  onOptimize(request: OptimizeRequest) {
    this.isLoading = true;
    this.error = null;
    this.lastRequest = request;
    
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
