export type UserRole = 'student' | 'tutor' | 'admin'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface LoginPayload {
  email: string
  password: string
  role?: UserRole
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  user: AuthUser
}

export interface RegisterStudentPayload {
  name: string
  email: string
  password: string
  phone: string
  grade: string
  address: string
}

export interface RegisterTutorPayload {
  name: string
  email: string
  password: string
  phone: string
  qualification: string
  experienceYears: number
  bio: string
  subjects: string[]
}
