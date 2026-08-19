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
  initialized: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
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
      initialized: false,

      async login(payload) {
        set({ status: 'loading', error: null })
        try {
          const res = await authApi.login(payload)
          tokenStorage.set(res.accessToken, res.refreshToken)
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
          set({ user: null, isAuthenticated: false, status: 'idle', error: null, initialized: true })
          return
        }

        // If the store already has a user (e.g. just logged in or hydrated from
        // persist), skip the /me round-trip — the token is freshly valid.
        const currentUser = useAuthStore.getState().user
        if (currentUser) {
          set({ isAuthenticated: true, status: 'idle', error: null, initialized: true })
          return
        }

        set({ status: 'loading', error: null })
        try {
          const user = await authApi.me()
          set({ user, isAuthenticated: true, status: 'idle', error: null, initialized: true })
        } catch {
          tokenStorage.clear()
          set({ user: null, isAuthenticated: false, status: 'idle', error: null, initialized: true })
        }
      },

      logout() {
        tokenStorage.clear()
        set({ user: null, isAuthenticated: false, status: 'idle', error: null })
      },
    }),
    {
      name: 'auth',
      // Only persist identity; tokens live in tokenStorage.
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    },
  ),
)

// Keep the store in sync when the HTTP layer forces a logout (refresh failed).
window.addEventListener('auth:logout', () => useAuthStore.getState().logout())
