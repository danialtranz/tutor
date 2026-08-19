import type {
  AuthUser,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterStudentPayload,
  RegisterTutorPayload,
  ResetPasswordPayload,
} from './auth.types'
import { http } from '@/lib/api/http'
import { tokenStorage } from '@/lib/api/token-storage'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function createMockUser(email: string): AuthUser {
  const normalized = email.trim().toLowerCase()
  const role = normalized.includes('admin')
    ? 'admin'
    : normalized.includes('tutor')
    ? 'tutor'
    : 'student'

  return {
    id: Math.max(1, normalized.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 1000),
    name: normalized.includes('admin')
      ? 'Quản trị hệ thống'
      : normalized.includes('tutor')
      ? 'Gia sư mô phỏng'
      : 'Học viên mô phỏng',
    email,
    role,
    status: 'active',
    timeZoneId: 'Asia/Ho_Chi_Minh',
  }
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const res = await http.post<LoginResponse>('/api/v1/auth/login', payload)
      if (res.data?.accessToken) {
        tokenStorage.set(res.data.accessToken, res.data.refreshToken)
        return res.data
      }
    } catch {
      // Fallback to demo/mock login if backend is offline
    }

    await delay(400)
    if (payload.password !== 'password' && payload.password.length < 3) {
      const error = new Error('invalidCredentials')
      error.name = 'InvalidCredentials'
      throw error
    }

    const user = createMockUser(payload.email)
    if (payload.role && (payload.role === 'admin' || payload.role === 'tutor' || payload.role === 'student')) {
      user.role = payload.role
    }

    const accessToken = `mock-access-token-${user.role}`
    const refreshToken = `mock-refresh-token-${user.role}`

    tokenStorage.set(accessToken, refreshToken)

    return {
      accessToken,
      refreshToken,
      user,
    }
  },

  async registerStudent(payload: RegisterStudentPayload): Promise<{ user: AuthUser }> {
    try {
      const res = await http.post<{ user: AuthUser }>('/api/v1/auth/register/student', payload)
      if (res.data?.user) return res.data
    } catch {
      // Fallback
    }

    await delay(500)
    if (payload.email.includes('taken')) {
      const error = new Error('Email này đã được sử dụng')
      throw error
    }

    const user: AuthUser = {
      id: Math.floor(Math.random() * 1000) + 10,
      name: payload.name,
      email: payload.email,
      role: 'student',
      status: 'active',
      timeZoneId: 'Asia/Ho_Chi_Minh',
    }

    return { user }
  },

  async registerTutor(payload: RegisterTutorPayload): Promise<{ user: AuthUser }> {
    try {
      const res = await http.post<{ user: AuthUser }>('/api/v1/auth/register/tutor', payload)
      if (res.data?.user) return res.data
    } catch {
      // Fallback
    }

    await delay(500)
    if (payload.email.includes('taken')) {
      const error = new Error('Email này đã được sử dụng')
      throw error
    }

    const user: AuthUser = {
      id: Math.floor(Math.random() * 1000) + 10,
      name: payload.name,
      email: payload.email,
      role: 'tutor',
      status: 'active',
      timeZoneId: 'Asia/Ho_Chi_Minh',
    }

    return { user }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    try {
      await http.post('/api/v1/auth/forgot-password', payload)
      return
    } catch {
      // Fallback
    }

    await delay(400)
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    try {
      await http.post('/api/v1/auth/reset-password', payload)
      return
    } catch {
      // Fallback
    }

    await delay(400)
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    try {
      await http.put('/api/v1/users/me', payload)
      return
    } catch {
      // Fallback
    }

    await delay(400)
  },

  async me(): Promise<AuthUser> {
    try {
      const res = await http.get<AuthUser>('/api/v1/users/me')
      if (res.data?.email) {
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(300)
    const token = tokenStorage.getAccess()
    if (!token) {
      const error = new Error('unauthenticated')
      error.name = 'Unauthorized'
      throw error
    }

    if (token.includes('admin')) {
      return {
        id: 1,
        name: 'Quản trị hệ thống',
        email: 'admin@demo.com',
        role: 'admin',
        status: 'active',
        timeZoneId: 'Asia/Ho_Chi_Minh',
      }
    }

    if (token.includes('tutor')) {
      return {
        id: 2,
        name: 'Gia sư mô phỏng',
        email: 'tutor@demo.com',
        role: 'tutor',
        status: 'active',
        timeZoneId: 'Asia/Ho_Chi_Minh',
      }
    }

    return {
      id: 3,
      name: 'Học viên mô phỏng',
      email: 'student@demo.com',
      role: 'student',
      status: 'active',
      timeZoneId: 'Asia/Ho_Chi_Minh',
    }
  },

  async refresh(): Promise<{ accessToken: string; refreshToken?: string }> {
    try {
      const refresh = tokenStorage.getRefresh()
      const res = await http.post<{ accessToken: string; refreshToken?: string }>(
        '/api/v1/auth/refresh',
        { refreshToken: refresh },
      )
      if (res.data?.accessToken) {
        tokenStorage.set(res.data.accessToken, res.data.refreshToken)
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(300)
    const refresh = tokenStorage.getRefresh()
    if (!refresh) {
      const error = new Error('missingRefreshToken')
      error.name = 'Unauthorized'
      throw error
    }

    const role = refresh.includes('admin')
      ? 'admin'
      : refresh.includes('tutor')
      ? 'tutor'
      : 'student'

    const accessToken = `mock-access-token-${role}`
    const refreshToken = `mock-refresh-token-${role}`

    tokenStorage.set(accessToken, refreshToken)
    return { accessToken, refreshToken }
  },

  async logout(): Promise<void> {
    try {
      await http.post('/api/v1/auth/logout')
    } catch {
      // Ignore
    } finally {
      tokenStorage.clear()
    }
  },
}
