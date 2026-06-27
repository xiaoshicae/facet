import { Search } from 'lucide-react'
import { useCommandStore } from '@/stores/tool-store'

/** 无边框标题栏：macOS 拖拽区 + 命令面板入口。 */
export function TitleBar() {
  const setOpen = useCommandStore((s) => s.setOpen)

  return (
    <div
      data-tauri-drag-region=""
      className="flex h-8 shrink-0 items-center justify-end px-3"
    >
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-overlay/[0.08] bg-overlay/[0.03] px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-overlay/[0.06] hover:text-foreground cursor-pointer"
        title="命令面板"
      >
        <Search className="size-3" />
        <span>搜索工具</span>
        <kbd className="rounded bg-overlay/[0.08] px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
      </button>
    </div>
  )
}
