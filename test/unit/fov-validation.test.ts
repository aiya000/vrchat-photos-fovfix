import { describe, it, expect } from 'vitest'
import { fovSchema } from '@/lib/fovfix'

describe('FOV Validation Behavior', () => {
  describe('境界値テスト', () => {
    it('最小値1を受け入れる', () => {
      const result = fovSchema.safeParse(1)
      expect(result.success).toBe(true)
    })

    it('最大値179を受け入れる', () => {
      const result = fovSchema.safeParse(179)
      expect(result.success).toBe(true)
    })

    it('0を拒否する', () => {
      const result = fovSchema.safeParse(0)
      expect(result.success).toBe(false)
    })

    it('180を拒否する', () => {
      const result = fovSchema.safeParse(180)
      expect(result.success).toBe(false)
    })

    it('負の値を拒否する', () => {
      const result = fovSchema.safeParse(-1)
      expect(result.success).toBe(false)
    })

    it('180を超える値を拒否する', () => {
      const result = fovSchema.safeParse(181)
      expect(result.success).toBe(false)
    })
  })

  describe('エラー状態のリセットシナリオ', () => {
    it('無効な値の後に有効な値を検証できる', () => {
      // First validate an invalid value
      const invalidResult = fovSchema.safeParse(0)
      expect(invalidResult.success).toBe(false)

      // Then validate a valid value - should succeed
      const validResult = fovSchema.safeParse(50)
      expect(validResult.success).toBe(true)
    })

    it('複数の無効な値を順次検証できる', () => {
      const result1 = fovSchema.safeParse(0)
      expect(result1.success).toBe(false)

      const result2 = fovSchema.safeParse(180)
      expect(result2.success).toBe(false)

      const result3 = fovSchema.safeParse(-5)
      expect(result3.success).toBe(false)

      // Should still accept valid value after multiple invalid attempts
      const validResult = fovSchema.safeParse(60)
      expect(validResult.success).toBe(true)
    })

    it('デフォルト値50は常に有効', () => {
      const result = fovSchema.safeParse(50)
      expect(result.success).toBe(true)
    })
  })

  describe('型チェック', () => {
    it('整数のみを受け入れる', () => {
      expect(fovSchema.safeParse(50.5).success).toBe(false)
      expect(fovSchema.safeParse(1.1).success).toBe(false)
      expect(fovSchema.safeParse(178.9).success).toBe(false)
    })

    it('文字列を拒否する', () => {
      expect(fovSchema.safeParse('50' as unknown).success).toBe(false)
    })

    it('nullを拒否する', () => {
      expect(fovSchema.safeParse(null as unknown).success).toBe(false)
    })

    it('undefinedを拒否する', () => {
      expect(fovSchema.safeParse(undefined as unknown).success).toBe(false)
    })
  })

  describe('エラーメッセージシナリオ', () => {
    it('0以下の値で適切なエラー情報を返す', () => {
      const result = fovSchema.safeParse(0)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeDefined()
      }
    })

    it('180以上の値で適切なエラー情報を返す', () => {
      const result = fovSchema.safeParse(180)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeDefined()
      }
    })

    it('非整数で適切なエラー情報を返す', () => {
      const result = fovSchema.safeParse(50.5)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeDefined()
      }
    })
  })

  describe('リアルタイムバリデーションシミュレーション', () => {
    it('ユーザーが0を入力した直後に無効と判定する', () => {
      const userInput = 0
      const result = fovSchema.safeParse(userInput)
      expect(result.success).toBe(false)
    })

    it('ユーザーが180を入力した直後に無効と判定する', () => {
      const userInput = 180
      const result = fovSchema.safeParse(userInput)
      expect(result.success).toBe(false)
    })

    it('ユーザーが50に戻した時に有効と判定する', () => {
      // Simulate: 0 -> invalid, then 50 -> valid
      const invalidInput = fovSchema.safeParse(0)
      expect(invalidInput.success).toBe(false)

      const validInput = fovSchema.safeParse(50)
      expect(validInput.success).toBe(true)
    })
  })

  describe('処理前のダブルチェック', () => {
    it('修正ボタンクリック前のバリデーションで無効な値をブロック', () => {
      const fovValue = 0
      const preProcessValidation = fovSchema.safeParse(fovValue)
      
      expect(preProcessValidation.success).toBe(false)
      // In the actual app, this would prevent handleFix from proceeding
    })

    it('修正ボタンクリック前のバリデーションで有効な値を許可', () => {
      const fovValue = 60
      const preProcessValidation = fovSchema.safeParse(fovValue)
      
      expect(preProcessValidation.success).toBe(true)
      // In the actual app, this would allow handleFix to proceed
    })
  })
})
