import { createContext } from 'react'
import type { ToolMeta } from '@/registry/types'

/** 当前路由所在工具的 meta,供 ToolWorkbench 等读取(如 aiActions)。 */
export const ToolContext = createContext<ToolMeta | null>(null)
