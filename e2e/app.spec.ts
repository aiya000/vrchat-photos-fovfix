import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

/**
 * E2Eテスト: ユーザーの正常系シナリオ
 * 
 * このテストは、ユーザーがアプリケーションを使用する典型的なフローをカバーします：
 * 1. ページにアクセス
 * 2. 写真をアップロード
 * 3. FOV値を確認・調整
 * 4. 修正ボタンをクリック
 * 5. 処理完了を確認
 * 6. ダウンロードボタンが表示されることを確認
 */

test.describe('VRChat Photos FOV Fix - 正常系E2Eテスト', () => {
  test('写真アップロード → FOV調整 → 修正 → ダウンロード の完全なワークフロー', async ({ page }) => {
    // Step 1: ページにアクセス
    await page.goto('/')
    
    // サイトタイトルが表示されることを確認
    await expect(page.locator('h1')).toBeVisible()
    
    // Step 2: 写真をアップロード
    const fileInputLocator = page.locator('input[type="file"]')
    await expect(fileInputLocator).toBeAttached()
    
    const testImagePath = path.join(__dirname, 'fixtures', 'test-photo.png')
    
    // テスト用画像が存在することを確認
    expect(fs.existsSync(testImagePath)).toBe(true)
    
    // ファイルをアップロード
    await fileInputLocator.setInputFiles(testImagePath)
    
    // 画像がアップロードされたことを確認（プレビュー画像が表示される）
    await expect(page.locator('img[alt*="Preview"]').or(page.locator('img[src*="blob:"]')).first()).toBeVisible({ timeout: 10000 })
    
    // Step 3: FOV値の確認
    const fovInput = page.locator('input[id="fov-input"]').or(page.locator('input[type="number"]'))
    await expect(fovInput.first()).toBeVisible()
    
    // デフォルトのFOV値が50であることを確認
    await expect(fovInput.first()).toHaveValue('50')
    
    // FOV値を変更してみる（例: 60に変更）
    await fovInput.first().fill('60')
    await expect(fovInput.first()).toHaveValue('60')
    
    // Step 4: 修正ボタンをクリック
    const fixButton = page.getByRole('button', { name: /修正|Fix/i })
    await expect(fixButton).toBeVisible()
    await expect(fixButton).toBeEnabled()
    await fixButton.click()
    
    // 処理中の表示を確認（オプション: タイムアウトを短く設定）
    // Note: 処理が非常に速い場合は表示されない可能性があるため、waitForは使わない
    
    // Step 5: 処理完了を待つ
    // ダウンロードボタンが表示されるまで待機
    const downloadButton = page.getByRole('button', { name: /ダウンロード|Download/i })
    await expect(downloadButton).toBeVisible({ timeout: 30000 })
    await expect(downloadButton).toBeEnabled()
    
    // 修正前後の画像が表示されることを確認
    const images = page.locator('img[src*="blob:"]')
    const imageCount = await images.count()
    expect(imageCount).toBeGreaterThanOrEqual(2) // 元画像と修正後画像
    
    // Step 6: ダウンロードボタンのクリック（実際のダウンロードはテストしない）
    // Note: 実際のダウンロードを行うとファイルシステムに影響するため、
    // ボタンが有効であることの確認のみ行う
    await expect(downloadButton).toBeEnabled()
    
    // 正常に完了
    console.log('✓ E2Eテスト完了: すべてのステップが成功しました')
  })

  test('複数の写真をアップロードして一括処理', async ({ page }) => {
    await page.goto('/')
    
    const fileInputLocator = page.locator('input[type="file"]')
    const testImagePath = path.join(__dirname, 'fixtures', 'test-photo.png')
    
    // 同じ画像を2回アップロード（実際には異なる画像として扱われる）
    await fileInputLocator.setInputFiles([testImagePath, testImagePath])
    
    // 複数の画像がアップロードされたことを確認（アップロード完了まで待機）
    const uploadedImages = page.locator('img[src*="blob:"]')
    await expect(uploadedImages).toHaveCount(2, { timeout: 10000 })
    
    // 修正ボタンをクリック
    const fixButton = page.getByRole('button', { name: /修正|Fix/i })
    await fixButton.click()
    
    // ダウンロードボタンが表示されることを確認
    const downloadButton = page.getByRole('button', { name: /ダウンロード|Download/i })
    await expect(downloadButton).toBeVisible({ timeout: 30000 })
  })

  test('画像のクリア機能が動作する', async ({ page }) => {
    await page.goto('/')
    
    const fileInputLocator = page.locator('input[type="file"]')
    const testImagePath = path.join(__dirname, 'fixtures', 'test-photo.png')
    
    // 画像をアップロード
    await fileInputLocator.setInputFiles(testImagePath)
    await expect(page.locator('img[src*="blob:"]').first()).toBeVisible({ timeout: 10000 })
    
    // クリアボタンをクリック
    const clearButton = page.getByRole('button', { name: /クリア|Clear/i })
    await expect(clearButton).toBeVisible()
    await clearButton.click()
    
    // 画像が削除されたことを確認
    await expect(page.locator('img[src*="blob:"]')).toHaveCount(0, { timeout: 5000 })
  })

  test('無効なFOV値に対するバリデーション', async ({ page }) => {
    await page.goto('/')
    
    const fileInputLocator = page.locator('input[type="file"]')
    const testImagePath = path.join(__dirname, 'fixtures', 'test-photo.png')
    
    await fileInputLocator.setInputFiles(testImagePath)
    await expect(page.locator('img[src*="blob:"]').first()).toBeVisible({ timeout: 10000 })
    
    const fovInput = page.locator('input[id="fov-input"]').or(page.locator('input[type="number"]'))
    
    // 範囲外の値を入力（ただし、HTML5のバリデーションにより制限される可能性がある）
    await fovInput.first().fill('0')
    
    // 修正ボタンをクリック
    const fixButton = page.getByRole('button', { name: /修正|Fix/i })
    await fixButton.click()
    
    // ダウンロードボタンが表示されないことを確認（無効なFOV値で処理が進まない）
    const downloadButton = page.getByRole('button', { name: /ダウンロード|Download/i })
    await expect(downloadButton).not.toBeVisible({ timeout: 5000 })
  })

  test('FOV補正値を何度か変えて、修正を再実行する', async ({ page }) => {
    await page.goto('/')
    
    const fileInputLocator = page.locator('input[type="file"]')
    const testImagePath = path.join(__dirname, 'fixtures', 'test-photo.png')
    
    // 画像をアップロード
    await fileInputLocator.setInputFiles(testImagePath)
    await expect(page.locator('img[src*="blob:"]').first()).toBeVisible({ timeout: 10000 })
    
    const fovInput = page.locator('input[id="fov-input"]').or(page.locator('input[type="number"]'))
    const fixButton = page.getByRole('button', { name: /修正|Fix/i })
    const downloadButton = page.getByRole('button', { name: /ダウンロード|Download/i })
    
    // 1回目: FOV=60で修正
    await fovInput.first().fill('60')
    await expect(fovInput.first()).toHaveValue('60')
    await fixButton.click()
    await expect(downloadButton).toBeVisible({ timeout: 30000 })
    
    // 修正後の画像が表示されていることを確認
    const images = page.locator('img[src*="blob:"]')
    let imageCount = await images.count()
    expect(imageCount).toBeGreaterThanOrEqual(2) // 元画像と修正後画像
    
    // 2回目: FOV=45に変更して再修正
    await fovInput.first().fill('45')
    await expect(fovInput.first()).toHaveValue('45')
    await fixButton.click()
    await expect(downloadButton).toBeVisible({ timeout: 30000 })
    
    // 再度修正後の画像が表示されていることを確認
    imageCount = await images.count()
    expect(imageCount).toBeGreaterThanOrEqual(2)
    
    // 3回目: FOV=70に変更して再修正
    await fovInput.first().fill('70')
    await expect(fovInput.first()).toHaveValue('70')
    await fixButton.click()
    await expect(downloadButton).toBeVisible({ timeout: 30000 })
    
    // 最終的に修正後の画像が表示されていることを確認
    imageCount = await images.count()
    expect(imageCount).toBeGreaterThanOrEqual(2)
    
    // ダウンロードボタンが有効であることを確認
    await expect(downloadButton).toBeEnabled()
  })
})
