import { create } from 'zustand'
import { authApi } from '@/lib/api'
import type { UserResponse, LoginRequest, RegisterRequest } from '@/types'

interface AuthState {
  user: UserResponse | null
  isLoading: boolean
  error: string | null

  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  clearError: () => void
  setUser: (user: UserResponse) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const tokenRes = await authApi.login(data)
      localStorage.setItem('access_token', tokenRes.access_token)
      const user = await authApi.me()
      set({ user, isLoading: false })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail || 'Login muvaffaqiyatsiz'
      set({ error: msg, isLoading: false })
      throw err
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await authApi.register(data)
      const tokenRes = await authApi.login({ username: data.username, password: data.password })
      localStorage.setItem('access_token', tokenRes.access_token)
      const user = await authApi.me()
      set({ user, isLoading: false })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail || "Ro'yxatdan o'tish muvaffaqiyatsiz"
      set({ error: msg, isLoading: false })
      throw err
    }
  },

  logout: async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    localStorage.removeItem('access_token')
    set({ user: null })
  },

  fetchMe: async () => {
    const token = localStorage.getItem('access_token')
    if (!token) throw new Error('No token')
    const user = await authApi.me()
    set({ user })
  },

  clearError: () => set({ error: null }),
  setUser: (user) => set({ user }),
}))
