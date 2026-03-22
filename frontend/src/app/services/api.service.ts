import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OptimizeRequest } from '../models/optimize-request';
import { OptimizeResponse } from '../models/optimize-response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  optimize(data: OptimizeRequest): Observable<OptimizeResponse> {
    return this.http.post<OptimizeResponse>(`${this.baseUrl}/optimize`, data);
  }

  generateReport(data: any): Observable<{report: string}> {
    return this.http.post<{report: string}>(`${this.baseUrl}/report`, data);
  }
}
