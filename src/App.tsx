import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import AppLayout from '@/components/layout/app-layout'
import { CommandPalette } from '@/components/command-palette'
import Home from '@/views/home'
import ToolHost from '@/views/tool-host'
import Settings from '@/views/settings'
import { useThemeStore } from '@/stores/theme-store'
import { useAIStore } from '@/stores/ai-store'

export default function App() {
  const initTheme = useThemeStore((s) => s.init)
  const resolved = useThemeStore((s) => s.resolved)
  const initAI = useAIStore((s) => s.init)

  useEffect(() => {
    initTheme()
    initAI()
  }, [initTheme, initAI])

  return (
    <BrowserRouter>
      <CommandPalette />
      <Toaster theme={resolved} position="bottom-right" richColors />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tool/:id" element={<ToolHost />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
