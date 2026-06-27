import { create } from 'zustand'

const FAV_KEY = 'facet.favorites'

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

interface ToolState {
  /** 命令面板开关 */
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void

  /** 收藏的工具 id */
  favorites: string[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
}

export const useCommandStore = create<ToolState>((set, get) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),

  favorites: loadFavorites(),
  isFavorite: (id) => get().favorites.includes(id),
  toggleFavorite: (id) =>
    set((s) => {
      const favorites = s.favorites.includes(id)
        ? s.favorites.filter((f) => f !== id)
        : [...s.favorites, id]
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(favorites))
      } catch {
        // localStorage 不可用时忽略
      }
      return { favorites }
    }),
}))
