import { TestBed } from '@angular/core/testing';
import { ConfigPanelComponent } from './config-panel.component';

describe('ConfigPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigPanelComponent]
    }).compileComponents();
  });

  it('should create the config panel', () => {
    const fixture = TestBed.createComponent(ConfigPanelComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
