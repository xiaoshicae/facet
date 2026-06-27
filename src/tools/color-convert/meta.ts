import { Palette } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'color-convert',
  name: '颜色转换',
  category: '颜色',
  icon: Palette,
  keywords: ['color', '颜色', 'hex', 'rgb', 'hsl', '色值'],
  component: lazy(() => import('./color-convert')),
}
export default meta
