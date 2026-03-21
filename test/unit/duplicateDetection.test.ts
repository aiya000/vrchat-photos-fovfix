import { describe, it, expect } from 'vitest'
import { fileFingerprint, filterDuplicateFiles } from '@/lib/duplicateDetection'

function createMockFile(name: string, size: number, lastModified: number): File {
  const file = new File(['x'.repeat(size)], name, { type: 'image/png', lastModified })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

describe('fileFingerprint', () => {
  it('同じ属性を持つファイルには同じフィンガープリントを返す', () => {
    const file1 = createMockFile('photo.png', 1024, 1700000000000)
    const file2 = createMockFile('photo.png', 1024, 1700000000000)
    expect(fileFingerprint(file1)).toBe(fileFingerprint(file2))
  })

  it('名前が異なるファイルには異なるフィンガープリントを返す', () => {
    const file1 = createMockFile('photo1.png', 1024, 1700000000000)
    const file2 = createMockFile('photo2.png', 1024, 1700000000000)
    expect(fileFingerprint(file1)).not.toBe(fileFingerprint(file2))
  })

  it('サイズが異なるファイルには異なるフィンガープリントを返す', () => {
    const file1 = createMockFile('photo.png', 1024, 1700000000000)
    const file2 = createMockFile('photo.png', 2048, 1700000000000)
    expect(fileFingerprint(file1)).not.toBe(fileFingerprint(file2))
  })

  it('lastModifiedが異なるファイルには異なるフィンガープリントを返す', () => {
    const file1 = createMockFile('photo.png', 1024, 1700000000000)
    const file2 = createMockFile('photo.png', 1024, 1700000001000)
    expect(fileFingerprint(file1)).not.toBe(fileFingerprint(file2))
  })
})

describe('filterDuplicateFiles', () => {
  it('既存のファイルがない場合、すべてのファイルを新規として返す', () => {
    const files = [
      createMockFile('a.png', 100, 1000),
      createMockFile('b.png', 200, 2000),
    ]
    const result = filterDuplicateFiles(files, new Set())
    expect(result.newFiles).toHaveLength(2)
    expect(result.duplicateFileNames).toHaveLength(0)
  })

  it('すべてのファイルが重複している場合、空の新規リストと重複リストを返す', () => {
    const file1 = createMockFile('a.png', 100, 1000)
    const file2 = createMockFile('b.png', 200, 2000)
    const existing = new Set([fileFingerprint(file1), fileFingerprint(file2)])

    const incoming = [
      createMockFile('a.png', 100, 1000),
      createMockFile('b.png', 200, 2000),
    ]
    const result = filterDuplicateFiles(incoming, existing)
    expect(result.newFiles).toHaveLength(0)
    expect(result.duplicateFileNames).toEqual(['a.png', 'b.png'])
  })

  it('一部が重複している場合、重複していないファイルのみ新規として返す', () => {
    const existingFile = createMockFile('a.png', 100, 1000)
    const existing = new Set([fileFingerprint(existingFile)])

    const incoming = [
      createMockFile('a.png', 100, 1000),
      createMockFile('c.png', 300, 3000),
    ]
    const result = filterDuplicateFiles(incoming, existing)
    expect(result.newFiles).toHaveLength(1)
    expect(result.newFiles[0]?.name).toBe('c.png')
    expect(result.duplicateFileNames).toEqual(['a.png'])
  })

  it('同名だがサイズの異なるファイルは重複とみなさない', () => {
    const existingFile = createMockFile('photo.png', 100, 1000)
    const existing = new Set([fileFingerprint(existingFile)])

    const incoming = [createMockFile('photo.png', 999, 1000)]
    const result = filterDuplicateFiles(incoming, existing)
    expect(result.newFiles).toHaveLength(1)
    expect(result.duplicateFileNames).toHaveLength(0)
  })
})
