import type { Metadata } from 'next'
import { OssContent } from '@/components/OssContent'

export const metadata: Metadata = {
  title: 'Open Source Software - VRChat Photos Fovfix Tool',
  description:
    'View the open source software and licenses used by the VRChat Photos Fovfix Tool, including package details and license texts.',
  openGraph: {
    title: 'Open Source Software - VRChat Photos Fovfix Tool',
    description: 'Browse the open source packages and licenses that power the VRChat Photos Fovfix Tool.',
    type: 'website',
  },
}

export default function OssPage(): React.JSX.Element {
  return <OssContent />
}
