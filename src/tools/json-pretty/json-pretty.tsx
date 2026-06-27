import { invoke } from '@tauri-apps/api/core'
import { ClipboardPaste, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Button } from '@/components/ui/button'
import { useToolRun } from '@/hooks/use-tool-run'

/**
 * 极简「一键」JSON 美化：粘贴即自动格式化；
 * 「粘贴」从剪贴板读入，「格式化并复制」把结果一键写回剪贴板。
 */
export default function JsonPrettyTool() {
  const { input, output, error, run } = useToolRun()
  const exec = (text: string) => run(text, (t) => invoke<string>('json_format', { input: t, mode: 'pretty' }))

  async function fromClipboard() {
    try {
      exec(await navigator.clipboard.readText())
    } catch {
      toast.error('读取剪贴板失败')
    }
  }

  async function formatAndCopy() {
    if (error) return toast.error('JSON 无效，无法复制')
    if (!output) return toast.error('没有可复制的内容')
    try {
      await navigator.clipboard.writeText(output)
      toast.success('已格式化并复制')
    } catch {
      toast.error('复制失败')
    }
  }

  return (
    <ToolWorkbench
      title="JSON 一键格式化"
      language="json"
      toolbar={
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={fromClipboard}>
            <ClipboardPaste />
            粘贴
          </Button>
          <Button size="sm" onClick={formatAndCopy}>
            <Sparkles />
            格式化并复制
          </Button>
        </div>
      }
      input={input}
      output={output}
      error={error}
      onInputChange={exec}
      inputPlaceholder="粘贴 JSON 自动美化；或点「粘贴」从剪贴板读入，再「格式化并复制」一键完成"
      meta={error ? '' : output ? `✓ 已美化 · ${output.split('\n').length} 行` : '粘贴 JSON 即时美化'}
    />
  )
}
