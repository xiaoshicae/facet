import { Link2 } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'url-encode',
  name: 'URL 编解码',
  category: '编码',
  icon: Link2,
  keywords: ['url', 'uri', '编码', '解码', 'encode', 'decode', 'percent'],
  component: lazy(() => import('./url-encode')),
}
export default meta
