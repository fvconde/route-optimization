import { TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComponent]
    }).compileComponents();
  });

  it('should create the chart wrapper', () => {
    const fixture = TestBed.createComponent(ChartComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
