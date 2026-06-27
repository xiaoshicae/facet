import { Binary } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'base64',
  name: 'Base64 编解码',
  category: '编码',
  icon: Binary,
  keywords: ['base64', '编码', '解码', 'encode', 'decode'],
  component: lazy(() => import('./base64')),
  detectClipboard: (t) => /^[A-Za-z0-9+/=\s]+$/.test(t) && t.length > 8,
}
export default meta
