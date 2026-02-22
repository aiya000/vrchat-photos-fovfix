import { test, expect } from '@playwright/test'

/**
 * E2Eテスト: ハンバーガーメニューとOSSページ
 */

test.describe('ハンバーガーメニューとOSSページ', () => {
  test('ハンバーガーボタンでメニューが開閉する', async ({ page }) => {
    await page.goto('/')

    const menuButton = page.getByRole('button', { name: /メニューを開く|Open menu/i })
    await expect(menuButton).toBeVisible()

    const nav = page.locator('#nav-menu')

    // 初期状態ではメニューは非表示（aria-hidden="true"）
    await expect(nav).toHaveAttribute('aria-hidden', 'true')

    // クリックでメニューが開く
    await menuButton.click()
    await expect(nav).toHaveAttribute('aria-hidden', 'false')

    // 再度クリックでメニューが閉じる
    await menuButton.click()
    await expect(nav).toHaveAttribute('aria-hidden', 'true')
  })

  test('Escapeキーでメニューが閉じる', async ({ page }) => {
    await page.goto('/')

    const menuButton = page.getByRole('button', { name: /メニューを開く|Open menu/i })
    await menuButton.click()

    const nav = page.locator('#nav-menu')
    await expect(nav).toHaveAttribute('aria-hidden', 'false')

    await page.keyboard.press('Escape')
    await expect(nav).toHaveAttribute('aria-hidden', 'true')
  })

  test('メニュー外クリックでメニューが閉じる', async ({ page }) => {
    await page.goto('/')

    const menuButton = page.getByRole('button', { name: /メニューを開く|Open menu/i })
    await menuButton.click()

    const nav = page.locator('#nav-menu')
    await expect(nav).toHaveAttribute('aria-hidden', 'false')

    // ページの外側（メインコンテンツ）をクリック
    await page.locator('main').click()
    await expect(nav).toHaveAttribute('aria-hidden', 'true')
  })

  test('OSSリンクからOSSページに遷移する', async ({ page }) => {
    await page.goto('/')

    const menuButton = page.getByRole('button', { name: /メニューを開く|Open menu/i })
    await menuButton.click()

    const ossLink = page.getByRole('link', { name: /使用したOSS|OSS Licenses/i })
    await expect(ossLink).toBeVisible()
    await ossLink.click()

    await expect(page).toHaveURL(/\/oss/)
  })

  test('OSSページにライセンス情報が表示される', async ({ page }) => {
    await page.goto('/oss')

    // ページ見出しが表示される
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // 主要パッケージの見出しが表示される
    await expect(page.getByRole('heading', { name: 'Next.js' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'React' })).toBeVisible()

    // ライセンス展開ボタン（details 要素）が存在する
    const licenseDetails = page.locator('details')
    expect(await licenseDetails.count()).toBeGreaterThan(0)

    // ライセンスを展開するとテキストが表示される
    await licenseDetails.first().locator('summary').click()
    await expect(licenseDetails.first().locator('pre')).toBeVisible()
  })

  test('OSSページのリンクでトップページに戻る', async ({ page }) => {
    await page.goto('/oss')

    const backLink = page.getByRole('link', { name: /VRChat/i }).first()
    await expect(backLink).toBeVisible()
    await backLink.click()

    await expect(page).toHaveURL('/')
  })
})
