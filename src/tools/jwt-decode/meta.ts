import { KeyRound } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'jwt-decode',
  name: 'JWT 解析',
  category: '编码',
  icon: KeyRound,
  keywords: ['jwt', 'token', '令牌', 'decode', '解析', 'jose'],
  component: lazy(() => import('./jwt-decode')),
  detectClipboard: (t) => /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\./.test(t.trim()),
}
export default meta
