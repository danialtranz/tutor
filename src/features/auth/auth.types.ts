export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'student' | 'tutor' | 'admin'
  status: 'active' | 'locked'
  timeZoneId?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterStudentPayload {
  name: string
  email: string
  password: string
  phone: string
  gradeLevel: string
  learningNeeds: string
}

export interface RegisterTutorPayload {
  name: string
  email: string
  password: string
  phone: string
  bio: string
  qualification: string
  experienceYears: number
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  user: AuthUser
}
