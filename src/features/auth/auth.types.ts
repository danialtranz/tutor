export type UserRole = 'student' | 'tutor' | 'admin'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
  status: 'active' | 'locked'
  timeZoneId?: string
}

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
  gradeLevel?: string
  grade?: string
  learningNeeds?: string
  address?: string
}

export interface RegisterTutorPayload {
  name: string
  email: string
  password: string
  phone: string
  bio: string
  qualification: string
  experienceYears: number
  subjects?: string[]
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  user: AuthUser
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}
