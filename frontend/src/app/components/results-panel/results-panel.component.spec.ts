import { TestBed } from '@angular/core/testing';
import { ResultsPanelComponent } from './results-panel.component';

describe('ResultsPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsPanelComponent]
    }).compileComponents();
  });

  it('should create the results panel', () => {
    const fixture = TestBed.createComponent(ResultsPanelComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
