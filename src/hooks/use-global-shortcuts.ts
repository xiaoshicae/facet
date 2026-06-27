import { useEffect } from 'react'
import { useCommandStore } from '@/stores/tool-store'

/** Cmd/Ctrl+K 唤起命令面板（即便焦点在输入框/Monaco 也允许）。 */
export function useGlobalShortcuts() {
  const toggle = useCommandStore((s) => s.toggle)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener('keydown', handler, true)
    return () => document.removeEventListener('keydown', handler, true)
  }, [toggle])
}
