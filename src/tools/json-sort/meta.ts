import { ArrowDownAZ } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'json-sort',
  name: 'JSON 键排序',
  category: 'JSON',
  icon: ArrowDownAZ,
  keywords: ['json', 'sort', '排序', 'key', '键', '美化'],
  component: lazy(() => import('./json-sort')),
}
export default meta
