import { TestBed } from '@angular/core/testing';
import { ExperimentsPanelComponent } from './experiments-panel.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ExperimentsPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentsPanelComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create the experiments view', () => {
    const fixture = TestBed.createComponent(ExperimentsPanelComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
