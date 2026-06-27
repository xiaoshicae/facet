import { useCallback, useRef, useState } from 'react'

type Runner = (input: string) => Promise<string>

/**
 * 工具通用的「输入 → 变换 → 输出/错误」状态机。
 * 工具组件只需提供具体的 runner（通常是一次 invoke），
 * 参数（mode/algo 等）由组件自行闭包进 runner。
 *
 * - 空输入直接清空，不调用后端。
 * - 用序号守卫丢弃过期结果：连续快速输入时，只有「最后一次」的结果会被采用，
 *   避免较慢的旧请求后到、覆盖较新的输出。
 */
export function useToolRun() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string>()
  const seq = useRef(0)

  const run = useCallback(async (text: string, runner: Runner) => {
    setInput(text)
    const ticket = ++seq.current
    if (text === '') {
      setOutput('')
      setError(undefined)
      return
    }
    try {
      const result = await runner(text)
      if (ticket !== seq.current) return // 已有更新的输入，丢弃过期结果
      setOutput(result)
      setError(undefined)
    } catch (e) {
      if (ticket !== seq.current) return
      setError(String(e))
      setOutput('')
    }
  }, [])

  return { input, output, error, run }
}
