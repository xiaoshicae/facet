import { FileJson } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'json-yaml',
  name: 'JSON ⟷ YAML',
  category: 'JSON',
  icon: FileJson,
  keywords: ['json', 'yaml', 'yml', '转换', 'convert'],
  component: lazy(() => import('./json-yaml')),
}
export default meta
