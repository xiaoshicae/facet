import { KeyRound } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'jwt-decode',
  name: 'JWT 解析',
  category: '编码',
  icon: KeyRound,
  keywords: ['jwt', 'token', '令牌', 'decode', '解析', 'jose'],
  component: lazy(() => import('./jwt-decode')),
  detectClipboard: (t) => /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\./.test(t.trim()),
  aiActions: [
    {
      id: 'explain-claims',
      label: '解读 claims 含义',
      prompt: ({ output }) =>
        `下面是一个 JWT 解码后的 Header 与 Payload。请用中文解读各 claim 的含义，并指出可能的安全注意点（如是否过期、算法是否安全）：\n\n${output}`,
    },
  ],
}
export default meta
