import { Fingerprint } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'uuid',
  name: 'UUID 生成',
  category: '生成',
  icon: Fingerprint,
  keywords: ['uuid', 'guid', '唯一', 'id', '生成', 'v4'],
  component: lazy(() => import('./uuid')),
}
export default meta
