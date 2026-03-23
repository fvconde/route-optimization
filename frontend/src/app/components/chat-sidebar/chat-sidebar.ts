import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OptimizeResponse } from '../../models/optimize-response';
import { ApiService } from '../../services/api.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-chat-sidebar',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-sidebar.html',
  styleUrl: './chat-sidebar.scss'
})
export class ChatSidebar {
  @Input() result: OptimizeResponse | null = null;
  
  question: string = '';
  isAsking = false;
  chatHistory: ChatMessage[] = [];

  constructor(private apiService: ApiService) {}

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
