import '@testing-library/jest-dom'
import { vi } from 'vitest'


class ResizeObserver {
  constructor(callback) {
    this.callback = callback; 
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal('ResizeObserver', ResizeObserver)

