import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, Settings, Search } from 'lucide-react'
import { toolsByCategory, categories } from '@/registry'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const [query, setQuery] = useState('')
  const location = useLocation()
  const q = query.trim().toLowerCase()

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* 顶部品牌 + 搜索 */}
      <div className="shrink-0 px-3 pt-3 pb-2" data-tauri-drag-region="">
        <div className="mb-3 px-1 text-base font-semibold tracking-tight text-gradient">Facet</div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="过滤工具…"
            className="h-8 w-full rounded-lg border border-overlay/[0.08] bg-overlay/[0.03] pl-8 pr-2 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-primary/40"
          />
        </div>
      </div>

      {/* 固定入口 */}
      <nav className="shrink-0 px-2">
        <SidebarLink to="/" icon={Home} label="首页" active={location.pathname === '/'} />
      </nav>

      <div className="my-2 h-px shrink-0 bg-sidebar-border" />

      {/* 工具分组列表 */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {categories.map((cat) => {
          const items = toolsByCategory[cat].filter(
            (t) =>
              !q ||
              t.name.toLowerCase().includes(q) ||
              t.keywords.some((k) => k.toLowerCase().includes(q))
          )
          if (items.length === 0) return null
          return (
            <div key={cat} className="mb-3">
              <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {cat}
              </div>
              {items.map((t) => {
                const active = location.pathname === `/tool/${t.id}`
                return (
                  <NavLink
                    key={t.id}
                    to={`/tool/${t.id}`}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors',
                      active
                        ? 'bg-overlay/[0.06] text-foreground glow-ring'
                        : 'text-foreground/75 hover:bg-overlay/[0.05] hover:text-foreground'
                    )}
                  >
                    <t.icon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{t.name}</span>
                  </NavLink>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* 底部设置 */}
      <div className="shrink-0 border-t border-sidebar-border px-2 py-2">
        <SidebarLink
          to="/settings"
          icon={Settings}
          label="设置"
          active={location.pathname === '/settings'}
        />
      </div>
    </div>
  )
}

function SidebarLink({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string
  icon: typeof Home
  label: string
  active: boolean
}) {
  return (
    <NavLink
      to={to}
      className={cn(
        'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors',
        active
          ? 'bg-overlay/[0.06] text-foreground glow-ring'
          : 'text-foreground/75 hover:bg-overlay/[0.05] hover:text-foreground'
      )}
    >
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span>{label}</span>
    </NavLink>
  )
}
