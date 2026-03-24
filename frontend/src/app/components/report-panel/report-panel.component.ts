import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OptimizeResponse } from '../../models/optimize-response';
import { ApiService } from '../../services/api.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-report-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-panel.component.html',
  styleUrl: './report-panel.component.scss'
})
export class ReportPanelComponent implements OnChanges {
  @Input() result: OptimizeResponse | null = null;
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['result'] && !changes['result'].isFirstChange()) {
      // Limpa o relatório apenas quando um novo resultado (nova otimização) chega
      if (this.result) {
        this.reportText = null;
        this.chatHistory = [];
        this.question = '';
        this.error = null;
        this.isGenerating = false;
        this.isAsking = false;
      }
    }
  }
  
  isGenerating = false;
  reportText: string | null = null;
  error: string | null = null;

  question: string = '';
  isAsking = false;
  chatHistory: ChatMessage[] = [];

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

  askQuestion() {
    if (!this.result || !this.question.trim()) return;

    const userQ = this.question.trim();
    this.chatHistory.push({ role: 'user', text: userQ });
    this.question = '';
    this.isAsking = true;

    const payload = { ...this.result, question: userQ };

    this.apiService.generateReport(payload).subscribe({
      next: (res) => {
        this.chatHistory.push({ role: 'assistant', text: res.report });
        this.isAsking = false;
      },
      error: (err) => {
        console.error('Error asking question:', err);
        this.chatHistory.push({ role: 'assistant', text: 'Desculpe, ocorreu um erro ao processar sua pergunta.' });
        this.isAsking = false;
      }
    });
  }
}
