import { Braces } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'json-format',
  name: 'JSON 格式化',
  category: 'JSON',
  icon: Braces,
  keywords: ['json', '格式化', '美化', '压缩', '校验', 'format', 'beautify', 'minify'],
  component: lazy(() => import('./json-format')),
  detectClipboard: (t) => {
    const s = t.trim()
    return (s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))
  },
}
export default meta
