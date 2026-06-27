import type { LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'
import type { AIAction } from '@/lib/ai'

export interface ToolMeta {
  /** 唯一标识，如 'base64' */
  id: string
  /** 显示名 */
  name: string
  /** 分组：'编码' / 'JSON' / 'XML' / '正则' / '哈希' / '时间' */
  category: string
  /** 侧边栏/命令面板图标 */
  icon: LucideIcon
  /** 命令面板模糊搜索词 */
  keywords: string[]
  /** 工具主体组件（建议 lazy 懒加载） */
  component: ComponentType
  /** 可选：根据剪贴板内容智能识别该工具 */
  detectClipboard?: (text: string) => boolean
  /** 可选：工具内 AI 副驾动作。加一项即在工作台出现，核心零改动 */
  aiActions?: AIAction[]
}
