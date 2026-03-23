import { TestBed } from '@angular/core/testing';
import { ChatSidebar } from './chat-sidebar';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ChatSidebarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSidebar],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create the chat sidebar', () => {
    const fixture = TestBed.createComponent(ChatSidebar);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
