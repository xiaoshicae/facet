import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { useToolRun } from '@/hooks/use-tool-run'

export default function CaseConvertTool() {
  const { input, output, error, run } = useToolRun()
  const exec = (text: string) => run(text, (t) => invoke<string>('case_convert', { input: t }))

  return (
    <ToolWorkbench
      title="命名风格转换"
      input={input}
      output={output}
      error={error}
      onInputChange={exec}
      inputPlaceholder="输入任意命名，如 hello_world 或 getHTTPResponse…"
      meta={error ? '' : output ? '✓ 已生成 6 种命名风格' : '支持 snake / camel / kebab 等互转'}
    />
  )
}
