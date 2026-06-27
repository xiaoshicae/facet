import { Regex } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'regex-test',
  name: '正则验证',
  category: '正则',
  icon: Regex,
  keywords: ['regex', '正则', '正则表达式', 'match', '匹配', 'test'],
  component: lazy(() => import('./regex-test')),
}
export default meta
