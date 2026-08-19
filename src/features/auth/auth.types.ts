export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'student' | 'tutor' | 'admin'
  status: 'active' | 'locked'
  timeZoneId?: string
}

export type UserRole = AuthUser['role']

export interface LoginPayload {
  email: string
  password: string
  role?: string
}

export interface RegisterStudentPayload {
  name: string
  email: string
  password: string
  phone: string
}

export interface RegisterTutorPayload {
  name: string
  email: string
  password: string
  phone: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  user: AuthUser
}

export interface ForgotPasswordPayload {
  email: string
}

export interface VerifyEmailResponse {
  success: boolean
  message: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}
