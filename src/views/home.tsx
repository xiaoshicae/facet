import { useNavigate } from 'react-router-dom'
import { tools, categories, toolsByCategory } from '@/registry'

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-gradient">Facet</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            开发者工具箱 · 共 {tools.length} 个工具 · 按 <kbd className="rounded bg-overlay/[0.08] px-1.5 py-0.5 text-[11px]">⌘K</kbd> 快速搜索
          </p>
        </header>

        {categories.map((cat) => (
          <section key={cat} className="mb-7">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              {cat}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {toolsByCategory[cat].map((t) => (
                <button
                  key={t.id}
                  onClick={() => navigate(`/tool/${t.id}`)}
                  className="group flex flex-col items-start gap-2 rounded-2xl glass-card glass-card-hover p-4 text-left transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-overlay/[0.06] text-primary transition-colors group-hover:bg-overlay/[0.1]">
                    <t.icon className="size-4.5" />
                  </span>
                  <span className="text-sm font-medium">{t.name}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default Home
