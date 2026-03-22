import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptimizeResponse } from '../../models/optimize-response';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-report-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-panel.component.html',
  styleUrl: './report-panel.component.scss'
})
export class ReportPanelComponent {
  @Input() result: OptimizeResponse | null = null;
  
  isGenerating = false;
  reportText: string | null = null;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  generateReport() {
    if (!this.result) return;
    
    this.isGenerating = true;
    this.reportText = null;
    this.error = null;

    this.apiService.generateReport(this.result).subscribe({
      next: (res) => {
        this.reportText = res.report;
        this.isGenerating = false;
      },
      error: (err) => {
        console.error('Error generating report:', err);
        this.error = 'Falha ao gerar o relatório. Verifique se a chave OPENAI_API_KEY está configurada no backend.';
        this.isGenerating = false;
      }
    });
  }
}
