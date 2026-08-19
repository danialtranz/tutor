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

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await http.post<{
      accessToken: string
      refreshToken: string
      expiresIn: string
      email: string
      fullName: string
      role: string
    }>('/api/v1/auth/login', { email: payload.email, password: payload.password })

    tokenStorage.set(res.data.accessToken, res.data.refreshToken)
    const role = res.data.role?.toLowerCase() as 'student' | 'tutor' | 'admin'
    return {
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
      user: {
        id: 0,
        name: res.data.fullName,
        email: res.data.email,
        role,
        status: 'active',
        timeZoneId: 'Asia/Ho_Chi_Minh',
      },
    }
  },

  async registerStudent(payload: RegisterStudentPayload): Promise<{ user: AuthUser }> {
    const res = await http.post<{
      userId: number
      email: string
      fullName: string
      role: string
    }>('/api/v1/auth/register/student', {
      email: payload.email,
      password: payload.password,
      fullName: payload.name,
      phone: payload.phone,
      timeZoneId: 'Asia/Ho_Chi_Minh',
    })
    return {
      user: {
        id: res.data.userId,
        name: res.data.fullName,
        email: res.data.email,
        role: 'student',
        status: 'active',
        timeZoneId: 'Asia/Ho_Chi_Minh',
      },
    }
  },

  async registerTutor(payload: RegisterTutorPayload): Promise<{ user: AuthUser }> {
    const res = await http.post<{
      userId: number
      email: string
      fullName: string
      role: string
    }>('/api/v1/auth/register/tutor', {
      email: payload.email,
      password: payload.password,
      fullName: payload.name,
      phone: payload.phone,
      timeZoneId: 'Asia/Ho_Chi_Minh',
    })
    return {
      user: {
        id: res.data.userId,
        name: res.data.fullName,
        email: res.data.email,
        role: 'tutor',
        status: 'active',
        timeZoneId: 'Asia/Ho_Chi_Minh',
      },
    }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await http.post('/api/v1/auth/forgot-password', { email: payload.email })
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await http.post('/api/v1/auth/reset-password', {
      token: payload.token,
      newPassword: payload.newPassword,
    })
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await http.put('/api/v1/users/me', {
      fullName: '',
      phone: null,
      timeZoneId: 'Asia/Ho_Chi_Minh',
      ...payload,
    })
  },

  async me(): Promise<AuthUser> {
    const res = await http.get<{
      id: number
      email: string
      fullName: string
      phone?: string
      role: string
      status: string
      timeZoneId: string
    }>('/api/v1/users/me')
    return {
      id: res.data.id,
      name: res.data.fullName,
      email: res.data.email,
      role: res.data.role?.toLowerCase() as 'student' | 'tutor' | 'admin',
      status: res.data.status?.toLowerCase() === 'active' ? 'active' : 'locked',
      timeZoneId: res.data.timeZoneId,
    }
  },

  async refresh(): Promise<{ accessToken: string; refreshToken?: string }> {
    const refresh = tokenStorage.getRefresh()
    if (!refresh) {
      const error = new Error('missingRefreshToken')
      error.name = 'Unauthorized'
      throw error
    }
    const res = await http.post<{
      accessToken: string
      refreshToken: string
      expiresIn: string
    }>('/api/v1/auth/refresh', { refreshToken: refresh })
    tokenStorage.set(res.data.accessToken, res.data.refreshToken)
    return { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
  },

  async logout(): Promise<void> {
    try {
      const refresh = tokenStorage.getRefresh()
      await http.post('/api/v1/auth/logout', { refreshToken: refresh ?? '' })
    } catch {
      // Ignore logout errors
    } finally {
      tokenStorage.clear()
    }
  },
}
