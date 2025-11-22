import '@testing-library/jest-dom';
import { vi } from 'vitest';

declare global {
  interface Window {
    env: any;
  }
}

// Mock environment variables
window.env = {
  VITE_AZURE_OPENAI_API_KEY: 'test-api-key',
  VITE_AZURE_OPENAI_ENDPOINT: 'https://test-endpoint.openai.azure.com',
  VITE_AZURE_OPENAI_DEPLOYMENT: 'test-deployment',
  VITE_CLAUDE_API_KEY: 'test-claude-key',
};

// Mock fetch API
global.fetch = vi.fn();

// Mock browser APIs that may not be available in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock for IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    // this.callback = callback;
  }

  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// Mock for localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock for ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
};

// Mock for window.URL.createObjectURL
window.URL.createObjectURL = vi.fn(() => 'mock-object-url');
