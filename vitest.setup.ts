import { beforeAll, vi } from 'vitest'

beforeAll(() => {
  // Mock HTMLCanvasElement methods for testing
  HTMLCanvasElement.prototype.getContext = vi.fn(function (this: HTMLCanvasElement, contextId: string) {
    if (contextId === '2d') {
      return {
        fillStyle: '',
        fillRect: vi.fn(),
        drawImage: vi.fn(),
        getImageData: vi.fn(() => ({
          data: new Uint8ClampedArray(this.width * this.height * 4),
          width: this.width,
          height: this.height,
        })),
        putImageData: vi.fn(),
        createImageData: vi.fn((width: number, height: number) => ({
          data: new Uint8ClampedArray(width * height * 4),
          width,
          height,
        })),
      } as unknown as CanvasRenderingContext2D
    }
    return null
  })

  HTMLCanvasElement.prototype.toBlob = function (callback: (blob: Blob | null) => void, type = 'image/png') {
    // Create a minimal blob
    const buffer = new Uint8Array(100)
    const blob = new Blob([buffer], { type })
    setTimeout(() => callback(blob), 0)
  }
})
