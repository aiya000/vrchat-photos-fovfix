import { describe, it, expect, afterEach } from 'vitest'
import manifest from '../../src/app/manifest'

describe('PWAマニフェストのstart_url・scope', () => {
  const originalEnv = process.env.NEXT_PUBLIC_BASE_PATH

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_PATH
    } else {
      process.env.NEXT_PUBLIC_BASE_PATH = originalEnv
    }
  })

  it('NEXT_PUBLIC_BASE_PATHが未設定のとき start_url と scope が "/" になる', () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH
    const result = manifest()
    expect(result.start_url).toBe('/')
    expect(result.scope).toBe('/')
  })

  it('NEXT_PUBLIC_BASE_PATHが設定されているとき start_url と scope にbasePathが含まれる', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = 'vrchat-photos-fovfix'
    const result = manifest()
    expect(result.start_url).toBe('/vrchat-photos-fovfix/')
    expect(result.scope).toBe('/vrchat-photos-fovfix/')
  })
})
