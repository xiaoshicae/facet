import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'
import type { AIProvider } from '@/lib/ai'

function persist(providers: AIProvider[], activeId: string | null) {
  invoke('save_setting', { key: 'ai_providers', value: JSON.stringify(providers) }).catch(() => {})
  invoke('save_setting', { key: 'ai_active', value: activeId ?? '' }).catch(() => {})
}

interface AIState {
  providers: AIProvider[]
  activeId: string | null
  loaded: boolean
  init: () => Promise<void>
  active: () => AIProvider | undefined
  upsert: (p: AIProvider) => void
  remove: (id: string) => void
  setActive: (id: string | null) => void
}

export const useAIStore = create<AIState>((set, get) => ({
  providers: [],
  activeId: null,
  loaded: false,

  init: async () => {
    try {
      const raw = await invoke<string | null>('get_setting_cmd', { key: 'ai_providers' })
      const providers = raw ? (JSON.parse(raw) as AIProvider[]) : []
      const saved = await invoke<string | null>('get_setting_cmd', { key: 'ai_active' })
      set({ providers, activeId: saved || providers[0]?.id || null, loaded: true })
    } catch {
      set({ loaded: true })
    }
  },

  active: () => {
    const { providers, activeId } = get()
    return providers.find((p) => p.id === activeId)
  },

  upsert: (p) =>
    set((s) => {
      const exists = s.providers.some((x) => x.id === p.id)
      const providers = exists ? s.providers.map((x) => (x.id === p.id ? p : x)) : [...s.providers, p]
      const activeId = s.activeId ?? p.id
      persist(providers, activeId)
      return { providers, activeId }
    }),

  remove: (id) =>
    set((s) => {
      const providers = s.providers.filter((p) => p.id !== id)
      const activeId = s.activeId === id ? (providers[0]?.id ?? null) : s.activeId
      persist(providers, activeId)
      return { providers, activeId }
    }),

  setActive: (id) =>
    set((s) => {
      persist(s.providers, id)
      return { activeId: id }
    }),
}))
