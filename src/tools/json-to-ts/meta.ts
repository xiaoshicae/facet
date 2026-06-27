import { FileCode2 } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'json-to-ts',
  name: 'JSON → TypeScript',
  category: 'JSON',
  icon: FileCode2,
  keywords: ['json', 'typescript', 'ts', 'interface', '类型', 'type'],
  component: lazy(() => import('./json-to-ts')),
}
export default meta
