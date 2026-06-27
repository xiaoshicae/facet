import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'
import type { AIProvider } from '@/lib/ai'

type ProviderConfig = Omit<AIProvider, 'apiKey'>

/** 只把非敏感配置写进 settings.json;apiKey 走 keyring(secret_*)。 */
function persistConfig(providers: AIProvider[]) {
  const configs: ProviderConfig[] = providers.map(({ apiKey: _omit, ...rest }) => rest)
  invoke('save_setting', { key: 'ai_providers', value: JSON.stringify(configs) }).catch(() => {})
}

function persistActive(activeId: string | null) {
  invoke('save_setting', { key: 'ai_active', value: activeId ?? '' }).catch(() => {})
}

interface AIState {
  providers: AIProvider[]
  activeId: string | null
  loaded: boolean
  init: () => Promise<void>
  active: () => AIProvider | undefined
  upsert: (p: AIProvider) => Promise<void>
  remove: (id: string) => Promise<void>
  setActive: (id: string | null) => void
}

export const useAIStore = create<AIState>((set, get) => ({
  providers: [],
  activeId: null,
  loaded: false,

  init: async () => {
    try {
      const raw = await invoke<string | null>('get_setting_cmd', { key: 'ai_providers' })
      const configs = raw ? (JSON.parse(raw) as (ProviderConfig & { apiKey?: string })[]) : []
      const providers = await Promise.all(
        configs.map(async (c) => {
          const fromSecret = await invoke<string | null>('secret_get', { id: c.id }).catch(() => null)
          const apiKey = fromSecret ?? c.apiKey ?? ''
          // 旧版本明文存在 ai_providers 里 → 迁移进 keyring
          if (!fromSecret && apiKey) {
            invoke('secret_set', { id: c.id, value: apiKey }).catch(() => {})
          }
          return { id: c.id, name: c.name, format: c.format, baseUrl: c.baseUrl, model: c.model, apiKey }
        })
      )
      const saved = await invoke<string | null>('get_setting_cmd', { key: 'ai_active' })
      // 落地一次,确保 settings.json 里不再残留明文 key
      persistConfig(providers)
      set({ providers, activeId: saved || providers[0]?.id || null, loaded: true })
    } catch {
      set({ loaded: true })
    }
  },

  active: () => {
    const { providers, activeId } = get()
    return providers.find((p) => p.id === activeId)
  },

  upsert: async (p) => {
    await invoke('secret_set', { id: p.id, value: p.apiKey }).catch(() => {})
    set((s) => {
      const exists = s.providers.some((x) => x.id === p.id)
      const providers = exists ? s.providers.map((x) => (x.id === p.id ? p : x)) : [...s.providers, p]
      const activeId = s.activeId ?? p.id
      persistConfig(providers)
      persistActive(activeId)
      return { providers, activeId }
    })
  },

  remove: async (id) => {
    await invoke('secret_delete', { id }).catch(() => {})
    set((s) => {
      const providers = s.providers.filter((p) => p.id !== id)
      const activeId = s.activeId === id ? (providers[0]?.id ?? null) : s.activeId
      persistConfig(providers)
      persistActive(activeId)
      return { providers, activeId }
    })
  },

  setActive: (id) =>
    set(() => {
      persistActive(id)
      return { activeId: id }
    }),
}))
