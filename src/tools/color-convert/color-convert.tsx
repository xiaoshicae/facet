import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { useToolRun } from '@/hooks/use-tool-run'

export default function ColorConvertTool() {
  const { input, output, error, run } = useToolRun()
  const exec = (text: string) => run(text, (t) => invoke<string>('color_convert', { input: t }))

  return (
    <ToolWorkbench
      title="颜色转换"
      input={input}
      output={output}
      error={error}
      onInputChange={exec}
      inputPlaceholder="#ff0000 或 #f00 或 rgb(255, 0, 0)"
      meta={error ? '' : output ? '✓ HEX / RGB / HSL' : '支持 #HEX 与 rgb() 输入'}
    />
  )
}
