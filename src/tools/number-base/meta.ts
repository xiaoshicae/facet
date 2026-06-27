import { Calculator } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'number-base',
  name: '进制转换',
  category: '转换',
  icon: Calculator,
  keywords: ['base', '进制', 'binary', 'hex', 'oct', '二进制', '十六进制', 'radix'],
  component: lazy(() => import('./number-base')),
}
export default meta
