import { Wand2 } from 'lucide-react'
import { lazy } from 'react'
import type { ToolMeta } from '@/registry/types'

const meta: ToolMeta = {
  id: 'json-pretty',
  name: 'JSON 一键格式化',
  category: 'JSON',
  icon: Wand2,
  keywords: ['json', 'format', '格式化', '美化', '一键', 'pretty', 'beautify'],
  component: lazy(() => import('./json-pretty')),
  detectClipboard: (t) => {
    const s = t.trim()
    return (s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))
  },
  aiActions: [
    {
      id: 'repair',
      label: '修复这段 JSON',
      writeBack: true,
      prompt: ({ input }) =>
        `下面是一段可能有语法错误的 JSON。请只返回修正后的合法 JSON 本身，不要任何解释、不要代码块标记：\n\n${input}`,
    },
    {
      id: 'explain',
      label: '解释这段 JSON 的结构',
      prompt: ({ input }) =>
        `请用中文简要说明下面这段 JSON 的结构与各字段含义，分条列出：\n\n${input}`,
    },
  ],
}
export default meta
