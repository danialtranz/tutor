import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tokenStorage } from '@/lib/api/token-storage'
import { authApi } from './auth.api'
import type { AuthUser, LoginPayload, RegisterStudentPayload, RegisterTutorPayload } from './auth.types'

interface AuthState {
  user: AuthUser | null
  status: 'idle' | 'loading' | 'error'
  error: string | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  registerStudent: (payload: RegisterStudentPayload) => Promise<void>
  registerTutor: (payload: RegisterTutorPayload) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: 'idle',
      error: null,
      isAuthenticated: false,

      async login(payload) {
        set({ status: 'loading', error: null })
        try {
          const res = await authApi.login(payload)
          tokenStorage.set(res.accessToken, res.refreshToken)
          set({ user: res.user, isAuthenticated: true, status: 'idle' })
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Đăng nhập thất bại'
          set({ status: 'error', error: message })
          throw e
        }
      },

      async registerStudent(payload) {
        set({ status: 'loading', error: null })
        try {
          const res = await authApi.registerStudent(payload)
          tokenStorage.set(res.accessToken, res.refreshToken)
          set({ user: res.user, isAuthenticated: true, status: 'idle' })
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Đăng ký thất bại'
          set({ status: 'error', error: message })
          throw e
        }
      },

      async registerTutor(payload) {
        set({ status: 'loading', error: null })
        try {
          const res = await authApi.registerTutor(payload)
          tokenStorage.set(res.accessToken, res.refreshToken)
          set({ user: res.user, isAuthenticated: true, status: 'idle' })
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Đăng ký thất bại'
          set({ status: 'error', error: message })
          throw e
        }
      },

      logout() {
        tokenStorage.clear()
        set({ user: null, isAuthenticated: false, status: 'idle', error: null })
      },
    }),
    {
      name: 'auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    },
  ),
)

window.addEventListener('auth:logout', () => useAuthStore.getState().logout())
