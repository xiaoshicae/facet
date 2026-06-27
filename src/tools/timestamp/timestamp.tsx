import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Button } from '@/components/ui/button'
import { useToolRun } from '@/hooks/use-tool-run'

export default function TimestampTool() {
  const { input, output, error, run } = useToolRun()
  const exec = (text: string) => run(text, (t) => invoke<string>('timestamp_convert', { input: t }))

  return (
    <ToolWorkbench
      title="时间戳转换"
      toolbar={
        <Button size="sm" variant="outline" onClick={() => exec(String(Math.floor(Date.now() / 1000)))}>
          当前时间戳
        </Button>
      }
      input={input}
      output={output}
      error={error}
      onInputChange={exec}
      inputPlaceholder="输入 Unix 时间戳（秒/毫秒）或日期 2024-01-01 00:00:00…"
      meta={error ? '' : '自动识别：数字→日期 · 日期→时间戳'}
    />
  )
}
