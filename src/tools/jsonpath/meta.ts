import { Filter } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'jsonpath',
  name: 'JSONPath 查询',
  category: 'JSON',
  icon: Filter,
  keywords: ['json', 'jsonpath', 'path', '查询', 'query', '提取'],
  component: lazy(() => import('./jsonpath')),
}
export default meta
