import { useCallback, useEffect, useRef, useState } from 'react'
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
  const offs = useRef<Array<() => void>>([])

  const cleanup = useCallback(() => {
    offs.current.forEach((f) => f())
    offs.current = []
  }, [])

  // 卸载时清理仍挂着的事件监听
  useEffect(() => cleanup, [cleanup])

  const reset = useCallback(() => {
    setOutput('')
    setError(undefined)
    setRunning(false)
  }, [])

  const run = useCallback(
    async (provider: AIProvider, action: AIAction, ctx: AIActionContext) => {
      cleanup() // 清掉上一次可能仍在的监听
      const id = `${Date.now()}-${++seq.current}`
      setOutput('')
      setError(undefined)
      setRunning(true)

      offs.current.push(await listen<string>(`ai-chunk-${id}`, (e) => setOutput((o) => o + e.payload)))
      offs.current.push(
        await listen(`ai-done-${id}`, () => {
          cleanup()
          setRunning(false)
        })
      )
      offs.current.push(
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
    [cleanup]
  )

  return { output, running, error, run, reset }
}
