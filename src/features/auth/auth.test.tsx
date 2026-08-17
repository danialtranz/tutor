import { describe, it, expect } from 'vitest'
import { authApi } from './auth.api'

describe('authApi', () => {
  it('allows logging in with correct payload', async () => {
    const res = await authApi.login({
      email: 'admin@tutor.com',
      password: 'password',
      role: 'admin',
    })
    expect(res.user.role).toBe('admin')
    expect(res.accessToken).toBeDefined()
  })

  it('allows student registration', async () => {
    const res = await authApi.registerStudent({
      name: 'Nguyen Van Học Viên',
      email: 'student@test.com',
      password: 'password123',
      phone: '0912345678',
      grade: 'Lớp 10',
      address: 'Hà Nội',
    })
    expect(res.user.role).toBe('student')
    expect(res.user.name).toBe('Nguyen Van Học Viên')
  })

  it('allows tutor registration', async () => {
    const res = await authApi.registerTutor({
      name: 'Tran Gia Su',
      email: 'giasu@test.com',
      password: 'password123',
      phone: '0987654321',
      qualification: 'Dai hoc Su pham',
      experienceYears: 3,
      bio: 'Gia su tieng Anh',
      subjects: ['Tieng Anh'],
    })
    expect(res.user.role).toBe('tutor')
    expect(res.user.name).toBe('Tran Gia Su')
  })
})
