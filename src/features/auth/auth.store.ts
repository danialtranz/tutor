import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tokenStorage } from '@/lib/api/token-storage'
import { authApi } from './auth.api'
import type {
  AuthUser,
  LoginPayload,
  RegisterStudentPayload,
  RegisterTutorPayload,
} from './auth.types'

interface AuthState {
  user: AuthUser | null
  status: 'idle' | 'loading' | 'error'
  error: string | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
  registerStudent: (payload: RegisterStudentPayload) => Promise<void>
  registerTutor: (payload: RegisterTutorPayload) => Promise<void>
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
          // authApi.login() đã tự lưu token vào tokenStorage bên trong nó
          // (bao gồm cả bước gọi /users/me để lấy id thật) — không cần gọi tokenStorage.set() lại ở đây.
          const res = await authApi.login(payload)
          set({ user: res.user, isAuthenticated: true, status: 'idle' })
        } catch (e) {
          const message = e instanceof Error ? e.message : 'error'
          set({ status: 'error', error: message })
          throw e
        }
      },

      async registerStudent(payload) {
        set({ status: 'loading', error: null })
        try {
          await authApi.registerStudent(payload)
          set({ status: 'idle' })
        } catch (e) {
          const message = e instanceof Error ? e.message : 'error'
          set({ status: 'error', error: message })
          throw e
        }
      },

      async registerTutor(payload) {
        set({ status: 'loading', error: null })
        try {
          await authApi.registerTutor(payload)
          set({ status: 'idle' })
        } catch (e) {
          const message = e instanceof Error ? e.message : 'error'
          set({ status: 'error', error: message })
          throw e
        }
      },

      async initialize() {
        const token = tokenStorage.getAccess()
        if (!token) {
          set({ user: null, isAuthenticated: false, status: 'idle', error: null })
          return
        }

        set({ status: 'loading', error: null })
        try {
          const user = await authApi.me()
          set({ user, isAuthenticated: true, status: 'idle', error: null })
        } catch {
          tokenStorage.clear()
          set({ user: null, isAuthenticated: false, status: 'idle', error: null })
        }
      },

      async logout() {
        // Gọi API để revoke refreshToken ở BE, tránh token cũ vẫn dùng được sau khi logout.
        // Vẫn clear local state dù API lỗi (authApi.logout() đã tự clear tokenStorage trong finally).
        try {
          await authApi.logout()
        } finally {
          set({ user: null, isAuthenticated: false, status: 'idle', error: null })
        }
      },
    }),
    {
      name: 'auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    },
  ),
)

window.addEventListener('auth:logout', () => useAuthStore.getState().logout())