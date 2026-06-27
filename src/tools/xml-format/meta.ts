import { Code2 } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'xml-format',
  name: 'XML 格式化',
  category: 'XML',
  icon: Code2,
  keywords: ['xml', '格式化', '美化', 'format', 'beautify', 'pretty'],
  component: lazy(() => import('./xml-format')),
  detectClipboard: (t) => {
    const s = t.trim()
    return s.startsWith('<') && s.endsWith('>')
  },
}
export default meta
