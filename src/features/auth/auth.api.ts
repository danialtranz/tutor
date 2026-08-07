import type {
  LoginPayload,
  LoginResponse,
  RegisterStudentPayload,
  RegisterTutorPayload,
  UserRole,
} from './auth.types'

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    await new Promise((r) => setTimeout(r, 600))
    
    if (!payload.email || !payload.password) {
      throw new Error('Vui lòng nhập đầy đủ email và mật khẩu')
    }

    let role: UserRole = payload.role ?? 'student'
    if (payload.email.includes('admin')) {
      role = 'admin'
    } else if (payload.email.includes('tutor') || payload.email.includes('giasu')) {
      role = 'tutor'
    }

    const nameMap: Record<UserRole, string> = {
      admin: 'Quản trị viên Admin',
      tutor: 'Gia sư Nguyễn Văn A',
      student: 'Học viên Trần Thị B',
    }

    return {
      accessToken: `mock-access-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
      user: {
        id: Math.floor(Math.random() * 1000) + 1,
        name: nameMap[role],
        email: payload.email,
        role: role,
      },
    }
  },

  async registerStudent(payload: RegisterStudentPayload): Promise<LoginResponse> {
    await new Promise((r) => setTimeout(r, 700))
    if (!payload.email || !payload.password || !payload.name) {
      throw new Error('Vui lòng điền đầy đủ các thông tin bắt buộc')
    }

    return {
      accessToken: `mock-access-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
      user: {
        id: Math.floor(Math.random() * 1000) + 1,
        name: payload.name,
        email: payload.email,
        role: 'student',
      },
    }
  },

  async registerTutor(payload: RegisterTutorPayload): Promise<LoginResponse> {
    await new Promise((r) => setTimeout(r, 700))
    if (!payload.email || !payload.password || !payload.name) {
      throw new Error('Vui lòng điền đầy đủ các thông tin bắt buộc')
    }

    return {
      accessToken: `mock-access-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
      user: {
        id: Math.floor(Math.random() * 1000) + 1,
        name: payload.name,
        email: payload.email,
        role: 'tutor',
      },
    }
  },
}
