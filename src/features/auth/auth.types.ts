export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'student' | 'tutor' | 'admin'
  status: 'active' | 'locked' | 'inactive'
  timeZoneId?: string
}

export type UserRole = AuthUser['role']

export interface LoginPayload {
  email: string
  password: string
  // Đã xoá field `role`: LoginRequest của BE không nhận field này, gửi lên cũng bị BE bỏ qua.
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
  expiresIn?: string 
  user: AuthUser
}

export interface ForgotPasswordPayload {
  email: string
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

export interface ResendVerificationEmailPayload {
  email: string
}

export interface VerifyEmailResponse {
  success: boolean
  message?: string
}