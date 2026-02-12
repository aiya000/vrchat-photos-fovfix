import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { applyFovFix, imageToCanvas, canvasToBlob, FovSchema } from '@/lib/fovfix'

describe('FovSchema', () => {
  it('有効なFOV値を受け入れる', () => {
    expect(FovSchema.safeParse(1).success).toBe(true)
    expect(FovSchema.safeParse(50).success).toBe(true)
    expect(FovSchema.safeParse(179).success).toBe(true)
  })

  it('無効なFOV値を拒否する', () => {
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

  it('画像からCanvasを作成する', () => {
    const canvas = imageToCanvas(img)
    expect(canvas).toBeInstanceOf(HTMLCanvasElement)
    expect(canvas.width).toBe(100)
    expect(canvas.height).toBe(100)
  })
})

describe('canvasToBlob', () => {
  it('CanvasをBlobに変換する', async () => {
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

  it('同じサイズの新しいCanvasを作成する', () => {
    const result = applyFovFix(sourceCanvas, 50)
    expect(result).toBeInstanceOf(HTMLCanvasElement)
    expect(result.width).toBe(100)
    expect(result.height).toBe(100)
    expect(result).not.toBe(sourceCanvas)
  })

  it('無効なFOV値でエラーを投げる', () => {
    expect(() => applyFovFix(sourceCanvas, 0)).toThrow('Invalid FOV value')
    expect(() => applyFovFix(sourceCanvas, 180)).toThrow('Invalid FOV value')
    expect(() => applyFovFix(sourceCanvas, -5)).toThrow('Invalid FOV value')
  })

  it('FOV 60で歪み補正を適用する', () => {
    const result = applyFovFix(sourceCanvas, 60)
    expect(result).toBeInstanceOf(HTMLCanvasElement)

    const ctx = result.getContext('2d')
    expect(ctx).not.toBeNull()
    if (ctx !== null) {
      const imageData = ctx.getImageData(0, 0, result.width, result.height)
      expect(imageData.data.length).toBeGreaterThan(0)
    }
  })

  it('FOV 50で歪み補正を適用する', () => {
    const result = applyFovFix(sourceCanvas, 50)
    expect(result).toBeInstanceOf(HTMLCanvasElement)

    const ctx = result.getContext('2d')
    expect(ctx).not.toBeNull()
  })

  it('エッジケースのFOV値を処理する', () => {
    expect(() => applyFovFix(sourceCanvas, 1)).not.toThrow()
    expect(() => applyFovFix(sourceCanvas, 179)).not.toThrow()
  })
})

