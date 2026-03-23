import { TestBed } from '@angular/core/testing';
import { ComparisonPanelComponent } from './comparison-panel.component';

describe('ComparisonPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonPanelComponent]
    }).compileComponents();
  });

  it('should create the comparison panel', () => {
    const fixture = TestBed.createComponent(ComparisonPanelComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
