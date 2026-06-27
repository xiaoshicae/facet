import { Wand2 } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'json-pretty',
  name: 'JSON 一键格式化',
  category: 'JSON',
  icon: Wand2,
  keywords: ['json', 'format', '格式化', '美化', '一键', 'pretty', 'beautify'],
  component: lazy(() => import('./json-pretty')),
  detectClipboard: (t) => {
    const s = t.trim()
    return (s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))
  },
}
export default meta
