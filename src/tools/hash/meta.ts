import { Hash } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'hash',
  name: '哈希计算',
  category: '哈希',
  icon: Hash,
  keywords: ['hash', '哈希', 'md5', 'sha1', 'sha256', 'sha512', '摘要', 'digest'],
  component: lazy(() => import('./hash')),
}
export default meta
