import { useCallback, useState } from 'react'

type Runner = (input: string) => Promise<string>

/**
 * 工具通用的「输入 → 变换 → 输出/错误」状态机。
 * 工具组件只需提供具体的 runner（通常是一次 invoke），
 * 参数（mode/algo 等）由组件自行闭包进 runner。
 *
 * 空输入直接清空，不调用后端。
 */
export function useToolRun() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string>()

  const run = useCallback(async (text: string, runner: Runner) => {
    setInput(text)
    if (text === '') {
      setOutput('')
      setError(undefined)
      return
    }
    try {
      setOutput(await runner(text))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }, [])

  return { input, output, error, run }
}
