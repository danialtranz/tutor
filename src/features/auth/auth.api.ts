import type {
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterStudentPayload,
  RegisterTutorPayload,
  ResendVerificationEmailPayload,
  ResetPasswordPayload,
  VerifyEmailResponse,
} from './auth.types'
import { http } from '@/lib/api/http'
import { tokenStorage } from '@/lib/api/token-storage'

type ApiRole = number | 'Student' | 'Tutor' | 'Admin'
type ApiStatus = number

const roleMap: Record<string, AuthUser['role']> = {
  '1': 'admin',
  Admin: 'admin',
  '2': 'tutor',
  Tutor: 'tutor',
  '3': 'student',
  Student: 'student',
}

const statusMap: Record<string, AuthUser['status']> = {
  '1': 'active',
  Active: 'active',
  '2': 'locked',
  Locked: 'locked',
  '3': 'inactive',
  Inactive: 'inactive',
}

function toUser(data: {
  id?: number
  userId?: number
  email: string
  fullName: string
  role: ApiRole
  status?: ApiStatus
  timeZoneId?: string
}): AuthUser {
  return {
    id: data.id ?? data.userId ?? 0,
    name: data.fullName,
    email: data.email,
    role: roleMap[String(data.role)] ?? 'student',
    status: statusMap[String(data.status)] ?? 'active',
    timeZoneId: data.timeZoneId,
  }
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await http.post<{
      accessToken: string
      refreshToken: string
      expiresIn: string
      email: string
      fullName: string
      role: ApiRole
    }>('/api/v1/auth/login', {
      email: payload.email,
      password: payload.password,
    })

    tokenStorage.set(data.accessToken, data.refreshToken)

    // FIX: LoginResponse của BE không có id/userId.
    // Gọi thêm /users/me để lấy id thật, tránh AuthUser.id luôn = 0.
    const user = await authApi.me()

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
      user,
    }
  },

  async registerStudent(payload: RegisterStudentPayload): Promise<{ user: AuthUser }> {
    const { data } = await http.post<{
      userId: number
      email: string
      fullName: string
      role: ApiRole
    }>('/api/v1/auth/register/student', {
      email: payload.email,
      password: payload.password,
      fullName: payload.name,
      phone: payload.phone,
      timeZoneId: 'Asia/Ho_Chi_Minh',
    })
    return { user: toUser(data) }
  },

  async registerTutor(payload: RegisterTutorPayload): Promise<{ user: AuthUser }> {
    const { data } = await http.post<{
      userId: number
      email: string
      fullName: string
      role: ApiRole
    }>('/api/v1/auth/register/tutor', {
      email: payload.email,
      password: payload.password,
      fullName: payload.name,
      phone: payload.phone,
      timeZoneId: 'Asia/Ho_Chi_Minh',
    })
    return { user: toUser(data) }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await http.post('/api/v1/auth/forgot-password', payload)
  },

  async verifyEmail(token: string): Promise<VerifyEmailResponse | string> {
    const { data } = await http.get<VerifyEmailResponse | string>(
      '/api/v1/auth/verify-email',
      {
        params: { token },
      },
    )
    return data
  },

  async resendVerificationEmail(payload: ResendVerificationEmailPayload): Promise<void> {
    await http.post('/api/v1/auth/resend-verification-email', payload)
  },

  async validateResetToken(
    token: string,
  ): Promise<{ isValid: boolean; message?: string }> {
    const { data } = await http.post<{ isValid: boolean; message?: string }>(
      '/api/v1/auth/validate-reset-token',
      { token },
    )
    // trả cả message để UI có thể hiển thị lý do token không hợp lệ
    return data
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await http.post('/api/v1/auth/reset-password', {
      token: payload.token,
      newPassword: payload.newPassword,
      confirmPassword: payload.confirmPassword,
    })
  },

  async me(): Promise<AuthUser> {
    const { data } = await http.get<{
      id: number
      email: string
      fullName: string
      phone?: string
      role: ApiRole
      status: ApiStatus
      timeZoneId?: string
    }>('/api/v1/users/me')
    return toUser(data)
  },

  async refresh(): Promise<{
    accessToken: string
    refreshToken?: string
    expiresIn?: string
  }> {
    const refreshToken = tokenStorage.getRefresh()
    if (!refreshToken) throw new Error('Không có refresh token')
    const { data } = await http.post<{
      accessToken: string
      refreshToken: string
      expiresIn: string
    }>('/api/v1/auth/refresh', { refreshToken })
    tokenStorage.set(data.accessToken, data.refreshToken)
    return data
  },

  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefresh()
    try {
      await http.post('/api/v1/auth/logout', { refreshToken })
    } finally {
      tokenStorage.clear()
    }
  },

  async changePassword(_payload: {
    currentPassword: string
    newPassword: string
  }): Promise<never> {
    throw new Error(
      'API contract v2 chưa cung cấp endpoint đổi mật khẩu khi đã đăng nhập.',
    )
  },
}
