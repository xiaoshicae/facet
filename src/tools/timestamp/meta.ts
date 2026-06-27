import { Clock } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'timestamp',
  name: '时间戳转换',
  category: '时间',
  icon: Clock,
  keywords: ['timestamp', '时间戳', 'unix', '日期', 'date', 'time', '转换'],
  component: lazy(() => import('./timestamp')),
  detectClipboard: (t) => /^\d{10,13}$/.test(t.trim()),
}
export default meta
