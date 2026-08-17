import type {
  AuthUser,
  LoginPayload,
  LoginResponse,
  RegisterStudentPayload,
  RegisterTutorPayload,
} from './auth.types'
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
    await delay(500)
    if (payload.password !== 'password') {
      const error = new Error('invalidCredentials')
      error.name = 'InvalidCredentials'
      throw error
    }

    const user = createMockUser(payload.email)
    const accessToken = `mock-access-token-${user.role}`
    const refreshToken = `mock-refresh-token-${user.role}`

    tokenStorage.set(accessToken, refreshToken)

    return {
      accessToken,
      refreshToken,
      user,
    }
  },

  async registerStudent(payload: RegisterStudentPayload): Promise<void> {
    await delay(700)
    if (payload.email.includes('taken')) {
      const error = new Error('emailTaken')
      error.name = 'EmailTaken'
      throw error
    }
  },

  async registerTutor(payload: RegisterTutorPayload): Promise<void> {
    await delay(700)
    if (payload.email.includes('taken')) {
      const error = new Error('emailTaken')
      error.name = 'EmailTaken'
      throw error
    }
  },

  async me(): Promise<AuthUser> {
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
    await delay(400)
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
}
