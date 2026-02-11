import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { applyFovFix, imageToCanvas, canvasToBlob, FovSchema } from '../fovfix'

describe('FovSchema', () => {
  it('should accept valid FOV values', () => {
    expect(FovSchema.safeParse(1).success).toBe(true)
    expect(FovSchema.safeParse(50).success).toBe(true)
    expect(FovSchema.safeParse(179).success).toBe(true)
  })

  it('should reject invalid FOV values', () => {
    expect(FovSchema.safeParse(0).success).toBe(false)
    expect(FovSchema.safeParse(180).success).toBe(false)
    expect(FovSchema.safeParse(-10).success).toBe(false)
    expect(FovSchema.safeParse(200).success).toBe(false)
    expect(FovSchema.safeParse(1.5).success).toBe(false)
  })
})

describe('imageToCanvas', () => {
  let img: HTMLImageElement

  beforeEach(() => {
    img = document.createElement('img')
    Object.defineProperty(img, 'naturalWidth', { value: 100, writable: false })
    Object.defineProperty(img, 'naturalHeight', { value: 100, writable: false })
  })

  it('should create a canvas from an image', () => {
    const canvas = imageToCanvas(img)
    expect(canvas).toBeInstanceOf(HTMLCanvasElement)
    expect(canvas.width).toBe(100)
    expect(canvas.height).toBe(100)
  })
})

describe('canvasToBlob', () => {
  it('should convert canvas to blob', async () => {
    const canvas = document.createElement('canvas')
    canvas.width = 10
    canvas.height = 10
    const ctx = canvas.getContext('2d')
    if (ctx !== null) {
      ctx.fillStyle = 'red'
      ctx.fillRect(0, 0, 10, 10)
    }

    const blob = await canvasToBlob(canvas)
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('image/png')
  })
})

describe('applyFovFix', () => {
  let sourceCanvas: HTMLCanvasElement

  beforeEach(() => {
    sourceCanvas = document.createElement('canvas')
    sourceCanvas.width = 100
    sourceCanvas.height = 100
    const ctx = sourceCanvas.getContext('2d')
    if (ctx !== null) {
      ctx.fillStyle = 'blue'
      ctx.fillRect(0, 0, 100, 100)
    }
  })

  afterEach(() => {
    sourceCanvas.remove()
  })

  it('should create a new canvas with same dimensions', () => {
    const result = applyFovFix(sourceCanvas, 50)
    expect(result).toBeInstanceOf(HTMLCanvasElement)
    expect(result.width).toBe(100)
    expect(result.height).toBe(100)
    expect(result).not.toBe(sourceCanvas)
  })

  it('should throw error for invalid FOV', () => {
    expect(() => applyFovFix(sourceCanvas, 0)).toThrow('Invalid FOV value')
    expect(() => applyFovFix(sourceCanvas, 180)).toThrow('Invalid FOV value')
    expect(() => applyFovFix(sourceCanvas, -5)).toThrow('Invalid FOV value')
  })

  it('should apply distortion correction for FOV 60', () => {
    const result = applyFovFix(sourceCanvas, 60)
    expect(result).toBeInstanceOf(HTMLCanvasElement)
    
    const ctx = result.getContext('2d')
    expect(ctx).not.toBeNull()
    if (ctx !== null) {
      const imageData = ctx.getImageData(0, 0, result.width, result.height)
      expect(imageData.data.length).toBeGreaterThan(0)
    }
  })

  it('should apply distortion correction for FOV 50', () => {
    const result = applyFovFix(sourceCanvas, 50)
    expect(result).toBeInstanceOf(HTMLCanvasElement)
    
    const ctx = result.getContext('2d')
    expect(ctx).not.toBeNull()
  })

  it('should handle edge FOV values', () => {
    expect(() => applyFovFix(sourceCanvas, 1)).not.toThrow()
    expect(() => applyFovFix(sourceCanvas, 179)).not.toThrow()
  })
})
