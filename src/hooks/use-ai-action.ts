import { useCallback, useRef, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import type { AIAction, AIActionContext, AIProvider } from '@/lib/ai'

/**
 * 运行一个 AI 动作并流式接收结果。
 * Rust 侧按 request_id 发出 ai-chunk-{id} / ai-done-{id} / ai-error-{id} 事件。
 */
export function useAIAction() {
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string>()
  const seq = useRef(0)

  const reset = useCallback(() => {
    setOutput('')
    setError(undefined)
    setRunning(false)
  }, [])

  const run = useCallback(
    async (provider: AIProvider, action: AIAction, ctx: AIActionContext) => {
      const id = `${Date.now()}-${++seq.current}`
      setOutput('')
      setError(undefined)
      setRunning(true)

      const offs: Array<() => void> = []
      const cleanup = () => offs.forEach((f) => f())

      offs.push(await listen<string>(`ai-chunk-${id}`, (e) => setOutput((o) => o + e.payload)))
      offs.push(
        await listen(`ai-done-${id}`, () => {
          cleanup()
          setRunning(false)
        })
      )
      offs.push(
        await listen<string>(`ai-error-${id}`, (e) => {
          cleanup()
          setError(e.payload)
          setRunning(false)
        })
      )

      try {
        await invoke('ai_run', {
          req: {
            requestId: id,
            format: provider.format,
            baseUrl: provider.baseUrl,
            model: provider.model,
            apiKey: provider.apiKey,
            system: action.system ?? null,
            prompt: action.prompt(ctx),
          },
        })
      } catch (e) {
        cleanup()
        setError(String(e))
        setRunning(false)
      }
    },
    []
  )

  return { output, running, error, run, reset }
}
