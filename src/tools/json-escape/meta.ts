import { Quote } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'json-escape',
  name: 'JSON 转义',
  category: 'JSON',
  icon: Quote,
  keywords: ['json', 'escape', 'unescape', '转义', '反转义', '字符串'],
  component: lazy(() => import('./json-escape')),
}
export default meta
