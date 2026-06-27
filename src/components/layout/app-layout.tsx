import { useState, useCallback, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import Sidebar from './sidebar'
import { TitleBar } from './title-bar'
import { useGlobalShortcuts } from '@/hooks/use-global-shortcuts'

const SIDEBAR_WIDTH = 248

export default function AppLayout() {
  useGlobalShortcuts()
  const [collapsed, setCollapsed] = useState(false)
  const toggle = useCallback(() => setCollapsed((v) => !v), [])

  // ⌘/Ctrl+B 切换侧边栏
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggle])

  return (
    <div className="flex h-screen bg-background">
      {/* 左侧边栏 */}
      <aside
        className="shrink-0 overflow-hidden transition-[width] duration-200 ease-in-out"
        style={{ width: collapsed ? 0 : SIDEBAR_WIDTH }}
      >
        <div style={{ width: SIDEBAR_WIDTH }} className="h-full">
          <Sidebar />
        </div>
      </aside>

      {/* 拖拽条 + 折叠按钮 */}
      <div className="relative flex shrink-0 items-center">
        {!collapsed && <div className="h-full w-px divider-glow" />}
        <button
          onClick={toggle}
          className="absolute top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full glass-card text-muted-foreground opacity-0 shadow-lg transition-all hover:text-foreground hover:opacity-100 focus:opacity-100 cursor-pointer"
          style={{ left: collapsed ? 4 : -12 }}
          title="⌘B"
        >
          {collapsed ? <PanelLeftOpen className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
        </button>
      </div>

      {/* 主内容区 */}
      <main className="relative min-w-0 flex-1 overflow-hidden bg-background">
        <TitleBar />
        <div className="h-[calc(100%-2rem)] overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
