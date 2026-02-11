import { z } from 'zod/v4'

export const FovSchema = z.number().int().min(1).max(179)

/**
 * Apply barrel distortion correction to an image.
 *
 * Port of the ImageMagick barrel distortion formula used in the original
 * VRChat FOV fix scripts:
 *   k = fov / 60
 *   k2 = (k - k^3) / 6
 *   k4 = k
 *   barrel params: 0, k2, 0, k4
 *
 * The barrel distortion maps each output pixel at normalized radius r to
 * source radius: r_src = A*r^4 + B*r^3 + C*r^2 + D*r
 * where A=0, B=k2, C=0, D=k4.
 */
export function applyFovFix(sourceCanvas: HTMLCanvasElement, targetFov: number): HTMLCanvasElement {
  const parsed = FovSchema.safeParse(targetFov)
  if (!parsed.success) {
    throw new Error(`Invalid FOV value: ${String(targetFov)}`)
  }

  const width = sourceCanvas.width
  const height = sourceCanvas.height

  const sourceCtx = sourceCanvas.getContext('2d')
  if (sourceCtx === null) {
    throw new Error('Failed to get source canvas context')
  }

  const outputCanvas = document.createElement('canvas')
  outputCanvas.width = width
  outputCanvas.height = height
  const outputCtx = outputCanvas.getContext('2d')
  if (outputCtx === null) {
    throw new Error('Failed to get output canvas context')
  }

  const sourceData = sourceCtx.getImageData(0, 0, width, height)
  const outputData = outputCtx.createImageData(width, height)

  const k = targetFov / 60
  const k2 = (k - k * k * k) / 6
  const k4 = k

  const cx = width / 2
  const cy = height / 2
  const maxRadius = Math.sqrt(cx * cx + cy * cy)

  const srcPixels = sourceData.data
  const dstPixels = outputData.data

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx
      const dy = y - cy
      const rd = Math.sqrt(dx * dx + dy * dy) / maxRadius

      // barrel distortion: r_src = B*r^3 + D*r (A=0, C=0)
      const rs = k2 * rd * rd * rd + k4 * rd

      const scale = rd > 0 ? rs / rd : 1
      const srcX = cx + dx * scale
      const srcY = cy + dy * scale

      // bilinear interpolation
      const x0 = Math.floor(srcX)
      const y0 = Math.floor(srcY)
      const x1 = x0 + 1
      const y1 = y0 + 1
      const fx = srcX - x0
      const fy = srcY - y0

      const dstIdx = (y * width + x) * 4

      if (x0 >= 0 && x1 < width && y0 >= 0 && y1 < height) {
        const idx00 = (y0 * width + x0) * 4
        const idx10 = (y0 * width + x1) * 4
        const idx01 = (y1 * width + x0) * 4
        const idx11 = (y1 * width + x1) * 4

        for (let c = 0; c < 4; c++) {
          const v00 = srcPixels[idx00 + c] ?? 0
          const v10 = srcPixels[idx10 + c] ?? 0
          const v01 = srcPixels[idx01 + c] ?? 0
          const v11 = srcPixels[idx11 + c] ?? 0

          const top = v00 + (v10 - v00) * fx
          const bottom = v01 + (v11 - v01) * fx
          const value = top + (bottom - top) * fy

          dstPixels[dstIdx + c] = Math.round(value)
        }
      } else {
        dstPixels[dstIdx + 0] = 0
        dstPixels[dstIdx + 1] = 0
        dstPixels[dstIdx + 2] = 0
        dstPixels[dstIdx + 3] = 255
      }
    }
  }

  outputCtx.putImageData(outputData, 0, 0)
  return outputCanvas
}

export function imageToCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (ctx === null) {
    throw new Error('Failed to get canvas context')
  }
  ctx.drawImage(img, 0, 0)
  return canvas
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        reject(new Error('Failed to convert canvas to blob'))
        return
      }
      resolve(blob)
    }, 'image/png')
  })
}
