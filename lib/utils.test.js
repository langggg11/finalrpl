import { describe, it, expect } from 'vitest'
import { formatTime } from './utils' // Impor fungsi yang mau dites

describe('formatTime (Unit Test)', () => {
  
  it('should format 90 seconds to 01:30', () => {
    expect(formatTime(90)).toBe('01:30')
  })

  it('should format 120 seconds to 02:00', () => {
    expect(formatTime(120)).toBe('02:00')
  })

  it('should handle zero correctly', () => {
    expect(formatTime(0)).toBe('00:00')
  })
  
  it('should handle less than a minute', () => {
    expect(formatTime(35)).toBe('00:35')
  })
    
  it('should handle large numbers (e.g., 3661 seconds)', () => {
    // 3661 detik = 61 menit 1 detik
    expect(formatTime(3661)).toBe('61:01')
  })
})