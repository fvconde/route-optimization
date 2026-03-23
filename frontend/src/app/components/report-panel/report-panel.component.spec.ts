import { TestBed } from '@angular/core/testing';
import { ReportPanelComponent } from './report-panel.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ReportPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPanelComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create the report root panel', () => {
    const fixture = TestBed.createComponent(ReportPanelComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
