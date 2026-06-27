import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 目标为输入框 / Monaco 时不应触发全局快捷键 */
export function isShortcutTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true
  if (target.closest('[data-facet-monaco-host]')) return true
  return false
}

/** 安全解析 JSON，失败时返回默认值 */
export function safeJsonParse<T>(json: string | undefined | null, fallback: T): T {
  if (!json) return fallback
  try {
    const parsed = JSON.parse(json)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}
