import { CaseSensitive } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'case-convert',
  name: '命名风格转换',
  category: '文本',
  icon: CaseSensitive,
  keywords: ['case', 'camel', 'snake', 'kebab', 'pascal', '命名', '驼峰', '下划线'],
  component: lazy(() => import('./case-convert')),
}
export default meta
