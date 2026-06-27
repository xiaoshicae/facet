import type { ToolMeta } from './types'

// 自动扫描所有 tools/*/meta.ts —— 加文件即注册，勿手写数组
const modules = import.meta.glob<{ default: ToolMeta }>('../tools/*/meta.ts', { eager: true })

export const tools: ToolMeta[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))

export const toolMap = new Map(tools.map((t) => [t.id, t]))

export const toolsByCategory = tools.reduce<Record<string, ToolMeta[]>>((acc, t) => {
  ;(acc[t.category] ??= []).push(t)
  return acc
}, {})

export const categories = Object.keys(toolsByCategory)

export type { ToolMeta }
