import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { RefreshCw, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'

const COUNTS = [
  { value: '1', label: '1 个' },
  { value: '5', label: '5 个' },
  { value: '10', label: '10 个' },
  { value: '25', label: '25 个' },
  { value: '50', label: '50 个' },
]

export default function UuidTool() {
  const [count, setCount] = useState('5')
  const [result, setResult] = useState('')

  async function generate(n = count) {
    try {
      setResult(await invoke<string>('uuid_generate', { count: Number(n) }))
    } catch (e) {
      toast.error(String(e))
    }
  }

  useEffect(() => {
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function copyAll() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      toast.success('已复制全部')
    } catch {
      toast.error('复制失败')
    }
  }

  const uuids = result ? result.split('\n') : []

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-tight">UUID 生成</h2>
        <div className="flex items-center gap-2">
          <Select
            value={count}
            onChange={(v) => {
              setCount(v)
              generate(v)
            }}
            options={COUNTS}
            className="w-28"
          />
          <Button size="sm" variant="outline" onClick={() => generate()}>
            <RefreshCw />
            重新生成
          </Button>
          <Button size="sm" variant="ghost" onClick={copyAll} title="复制全部">
            <Copy />
          </Button>
        </div>
      </div>

      <div className="glass-card min-h-0 flex-1 overflow-y-auto p-2">
        {uuids.map((u, i) => (
          <button
            key={`${u}-${i}`}
            onClick={() => {
              navigator.clipboard.writeText(u)
              toast.success('已复制')
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-left font-mono text-sm transition-colors hover:bg-overlay/[0.06] cursor-pointer"
            title="点击复制"
          >
            <span className="w-6 shrink-0 text-xs text-muted-foreground tabular-nums">{i + 1}</span>
            <span className="truncate">{u}</span>
          </button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground tabular-nums">UUID v4 · 共 {uuids.length} 个 · 点击任意条目复制</div>
    </div>
  )
}
