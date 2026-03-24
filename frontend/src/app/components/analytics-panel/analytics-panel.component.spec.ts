import { TestBed } from '@angular/core/testing';
import { AnalyticsPanelComponent } from './analytics-panel.component';

describe('AnalyticsPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsPanelComponent]
    }).compileComponents();
  });

  it('should create the analytics panel', () => {
    const fixture = TestBed.createComponent(AnalyticsPanelComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
