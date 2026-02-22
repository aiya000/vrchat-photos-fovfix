import type { Metadata } from 'next'
import { OssContent } from '@/components/OssContent'

export const metadata: Metadata = {
  title: 'オープンソースソフトウェア - VRChat Photos Fovfix Tool (Open Source Software)',
  description:
    'VRChat Photos Fovfix Tool で使用しているオープンソースソフトウェアとライセンス情報を確認できます。使用パッケージの詳細やライセンス本文を掲載しています。',
  openGraph: {
    title: 'オープンソースソフトウェア - VRChat Photos Fovfix Tool',
    description:
      'VRChat Photos Fovfix Tool で利用しているオープンソースパッケージとライセンス情報の一覧です。View the open source packages and licenses used by the VRChat Photos Fovfix Tool.',
    type: 'website',
  },
}

export default function OssPage(): React.JSX.Element {
  return <OssContent />
}
