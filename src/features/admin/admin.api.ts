import type {
  AdminUser,
  Complaint,
  ComplaintStatus,
  DashboardStats,
  Subject,
  TutorApplication,
  TutorApplicationStatus,
} from './admin.types'
import { http } from '@/lib/api/http'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let initialTutorApplications: TutorApplication[] = [
  {
    id: 'APP-101',
    fullName: 'Nguyễn Văn Minh',
    email: 'minh.nguyen@email.com',
    phone: '0901234567',
    qualification: 'Cử nhân Sư phạm Toán - ĐHQG Hà Nội',
    experienceYears: 4,
    subjects: ['Toán 10', 'Toán 11', 'Toán 12 - Ôn thi ĐH'],
    bio: 'Có 4 năm kinh nghiệm luyện thi đại học môn Toán, giúp hơn 50 học sinh đạt 8+ môn Toán.',
    degrees: [
      { name: 'Bằng Cử nhân Sư Phạm Toán (Loại Giỏi)', url: '#', verified: true },
      { name: 'Chứng chỉ Nghiệp vụ Sư phạm Quốc gia', url: '#', verified: true },
    ],
    createdAt: '2026-08-01',
    status: 'pending',
  },
  {
    id: 'APP-102',
    fullName: 'Trần Thị Thu Hà',
    email: 'ha.tran@email.com',
    phone: '0912345678',
    qualification: 'Thạc sĩ Ngôn ngữ Anh - ĐH Ngoại Ngữ',
    experienceYears: 6,
    subjects: ['Tiếng Anh THCS', 'IELTS Academic', 'Giao tiếp'],
    bio: 'Giảng viên tiếng Anh với chứng chỉ IELTS 8.5, chuyên trị học sinh mất gốc và luyện thi chứng chỉ.',
    degrees: [
      { name: 'Bằng Thạc sĩ Ngôn ngữ Anh', url: '#', verified: true },
      { name: 'Chứng chỉ IELTS 8.5', url: '#', verified: true },
    ],
    createdAt: '2026-08-03',
    status: 'pending',
  },
  {
    id: 'APP-103',
    fullName: 'Lê Hoàng Nam',
    email: 'nam.le@email.com',
    phone: '0934567890',
    qualification: 'Kỹ sư Vật lý Kỹ thuật - ĐH Bách Khoa',
    experienceYears: 2,
    subjects: ['Vật lý 10', 'Vật lý 11', 'Vật lý 12'],
    bio: 'Đam mê truyền cảm hứng yêu thích môn Vật lý cho các em học sinh bằng phương pháp thực nghiệm sinh động.',
    degrees: [{ name: 'Bằng Kỹ sư ĐH Bách Khoa', url: '#', verified: true }],
    createdAt: '2026-07-28',
    status: 'approved',
  },
]

let initialSubjects: Subject[] = [
  {
    id: 'SUB-01',
    code: 'MATH-HS',
    name: 'Toán học Phổ thông',
    category: 'Khoa học Tự nhiên',
    description: 'Bao gồm Toán Đại số & Hình học từ lớp 6 đến lớp 12',
    status: 'active',
    tutorCount: 42,
  },
  {
    id: 'SUB-02',
    code: 'PHYS-HS',
    name: 'Vật lý Phổ thông',
    category: 'Khoa học Tự nhiên',
    description: 'Lý thuyết & Bài tập Vật lý lớp 8 - lớp 12',
    status: 'active',
    tutorCount: 28,
  },
  {
    id: 'SUB-03',
    code: 'ENG-IELTS',
    name: 'Luyện thi IELTS',
    category: 'Ngoại ngữ',
    description: 'Luyện 4 kỹ năng Nghe - Nói - Đọc - Viết mọi cấp độ',
    status: 'active',
    tutorCount: 35,
  },
  {
    id: 'SUB-04',
    code: 'CHEM-HS',
    name: 'Hóa học Phổ thông',
    category: 'Khoa học Tự nhiên',
    description: 'Hóa học cơ bản và nâng cao từ lớp 8 đến lớp 12',
    status: 'active',
    tutorCount: 19,
  },
  {
    id: 'SUB-05',
    code: 'PROG-PY',
    name: 'Lập trình Python Cơ bản',
    category: 'Công nghệ Thông tin',
    description: 'Nhập môn lập trình tư duy thuật toán cho học sinh & sinh viên',
    status: 'inactive',
    tutorCount: 8,
  },
]

let initialComplaints: Complaint[] = [
  {
    id: 'CMP-201',
    complainantName: 'Lê Minh Anh (Học viên)',
    complainantRole: 'student',
    targetName: 'Gia sư Hoàng Văn X',
    title: 'Gia sư nghỉ học không báo trước 2 buổi',
    content: 'Tuần trước gia sư nghỉ 2 buổi vào thứ 4 và thứ 6 nhưng không nhắn tin báo trước làm gia đình mất thời gian chờ đợi.',
    status: 'pending',
    createdAt: '2026-08-05',
  },
  {
    id: 'CMP-202',
    complainantName: 'Phạm Quốc Bảo (Gia sư)',
    complainantRole: 'tutor',
    targetName: 'Phụ huynh Nguyễn Thu C',
    title: 'Phụ huynh chậm thanh toán học phí 2 tuần',
    content: 'Tôi đã hoàn thành 8 buổi dạy tháng 7 nhưng đến nay phụ huynh vẫn chưa chuyển khoản thanh toán như thỏa thuận.',
    status: 'in_progress',
    createdAt: '2026-08-02',
  },
]

let mockUsers: AdminUser[] = [
  {
    id: 'USR-01',
    name: 'Nguyễn Hoa',
    email: 'hoa@student.com',
    role: 'student',
    status: 'active',
  },
  {
    id: 'USR-02',
    name: 'Trần Văn Bình',
    email: 'binh@tutor.com',
    role: 'tutor',
    status: 'active',
  },
  {
    id: 'USR-03',
    name: 'Lê Thu Phương',
    email: 'phuong@student.com',
    role: 'student',
    status: 'locked',
  },
]

export const adminApi = {
  async getDashboardStats(params?: { startDate?: string; endDate?: string }): Promise<DashboardStats> {
    try {
      const res = await http.get<DashboardStats>('/api/v1/admin/dashboard', { params })
      if (res.data?.totalTutors !== undefined) {
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(300)
    const pendingCount = initialTutorApplications.filter((a) => a.status === 'pending').length
    const openComplaintsCount = initialComplaints.filter((c) => c.status !== 'resolved').length

    return {
      totalTutors: 128 + initialTutorApplications.filter((a) => a.status === 'approved').length,
      totalStudents: 450,
      pendingTutorApplications: pendingCount,
      openComplaints: openComplaintsCount,
      totalClassesBooked: 1240,
      monthlyRevenue: 85400000,
      monthlyGrowthPercent: 14.2,
      chartData: [
        { month: 'Tháng 3', applications: 24, bookings: 180 },
        { month: 'Tháng 4', applications: 30, bookings: 210 },
        { month: 'Tháng 5', applications: 45, bookings: 320 },
        { month: 'Tháng 6', applications: 38, bookings: 290 },
        { month: 'Tháng 7', applications: 52, bookings: 410 },
        { month: 'Tháng 8', applications: 60, bookings: 480 },
      ],
    }
  },

  async getTutorApplications(params?: {
    status?: TutorApplicationStatus | 'all'
    query?: string
    pageNumber?: number
    pageSize?: number
  }): Promise<TutorApplication[]> {
    try {
      const res = await http.get<TutorApplication[]>('/api/v1/admin/tutors', {
        params: {
          Status: params?.status !== 'all' ? params?.status : undefined,
          Search: params?.query,
          PageNumber: params?.pageNumber,
          PageSize: params?.pageSize,
        },
      })
      if (Array.isArray(res.data)) {
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(300)
    let list = [...initialTutorApplications]

    if (params?.status && params.status !== 'all') {
      list = list.filter((a) => a.status === params.status)
    }

    if (params?.query) {
      const q = params.query.toLowerCase()
      list = list.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.qualification.toLowerCase().includes(q),
      )
    }

    return list
  },

  async getTutorApplicationDetail(id: string): Promise<TutorApplication> {
    try {
      const res = await http.get<TutorApplication>(`/api/v1/admin/tutors/${id}`)
      if (res.data?.id) {
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(250)
    const app = initialTutorApplications.find((a) => a.id === id)
    if (!app) throw new Error('Không tìm thấy hồ sơ gia sư')
    return app
  },

  async reviewTutorApplication(
    id: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string,
  ): Promise<TutorApplication> {
    try {
      const res = await http.put<TutorApplication>(`/api/v1/admin/tutors/${id}/approval`, {
        status: status === 'approved' ? 'Approved' : 'Rejected',
        reason: rejectionReason,
      })
      if (res.data?.id) {
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(400)
    const existing = initialTutorApplications.find((a) => a.id === id)
    if (!existing) throw new Error('Không tìm thấy hồ sơ gia sư')

    const updated: TutorApplication = {
      ...existing,
      status,
      rejectionReason: status === 'rejected' ? rejectionReason : undefined,
    }
    const index = initialTutorApplications.findIndex((a) => a.id === id)
    initialTutorApplications[index] = updated
    return updated
  },

  async getSubjects(query?: string): Promise<Subject[]> {
    try {
      const res = await http.get<Subject[]>('/api/v1/subjects', {
        params: { search: query },
      })
      if (Array.isArray(res.data)) {
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(300)
    let list = [...initialSubjects]
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
      )
    }
    return list
  },

  async createSubject(data: Omit<Subject, 'id' | 'tutorCount'>): Promise<Subject> {
    try {
      const res = await http.post<Subject>('/api/v1/subjects', data)
      if (res.data?.id) {
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(400)
    const newSubject: Subject = {
      ...data,
      id: `SUB-${Date.now().toString().slice(-3)}`,
      tutorCount: 0,
    }
    initialSubjects.unshift(newSubject)
    return newSubject
  },

  async updateSubject(id: string, data: Partial<Subject>): Promise<Subject> {
    try {
      const res = await http.put<Subject>(`/api/v1/subjects/${id}`, data)
      if (res.data?.id) {
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(400)
    const existing = initialSubjects.find((s) => s.id === id)
    if (!existing) throw new Error('Không tìm thấy môn học')

    const updated: Subject = {
      ...existing,
      ...data,
    }
    const index = initialSubjects.findIndex((s) => s.id === id)
    initialSubjects[index] = updated
    return updated
  },

  async deleteSubject(id: string): Promise<void> {
    try {
      await http.put(`/api/v1/subjects/${id}/status`, { status: 'Inactive' })
      return
    } catch {
      // Fallback
    }

    await delay(300)
    initialSubjects = initialSubjects.filter((s) => s.id !== id)
  },

  async getComplaints(status?: ComplaintStatus | 'all'): Promise<Complaint[]> {
    try {
      const res = await http.get<Complaint[]>('/api/v1/admin/complaints', {
        params: { status: status !== 'all' ? status : undefined },
      })
      if (Array.isArray(res.data)) {
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(300)
    let list = [...initialComplaints]
    if (status && status !== 'all') {
      list = list.filter((c) => c.status === status)
    }
    return list
  },

  async getComplaintDetail(id: string): Promise<Complaint> {
    try {
      const res = await http.get<Complaint>(`/api/v1/admin/complaints/${id}`)
      if (res.data?.id) {
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(250)
    const item = initialComplaints.find((c) => c.id === id)
    if (!item) throw new Error('Không tìm thấy khiếu nại')
    return item
  },

  async resolveComplaint(
    id: string,
    status: 'resolved' | 'rejected',
    notes: string,
  ): Promise<Complaint> {
    try {
      const res = await http.patch<Complaint>(`/api/v1/admin/complaints/${id}`, {
        status: status === 'resolved' ? 'Resolved' : 'Rejected',
        resolutionNotes: notes,
      })
      if (res.data?.id) {
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(400)
    const existing = initialComplaints.find((c) => c.id === id)
    if (!existing) throw new Error('Không tìm thấy khiếu nại')

    const updated: Complaint = {
      ...existing,
      status,
      resolutionNotes: notes,
      resolvedAt: new Date().toISOString().split('T')[0],
    }
    const index = initialComplaints.findIndex((c) => c.id === id)
    initialComplaints[index] = updated
    return updated
  },

  async getUsers(query?: string): Promise<AdminUser[]> {
    try {
      const res = await http.get<AdminUser[]>('/api/v1/admin/users', {
        params: { search: query },
      })
      if (Array.isArray(res.data)) {
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(300)
    let list = [...mockUsers]
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        (user) =>
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          user.role.toLowerCase().includes(q),
      )
    }
    return list
  },

  async lockUser(id: string, reason?: string): Promise<AdminUser> {
    try {
      const res = await http.patch<AdminUser>(`/api/v1/admin/users/${id}/status`, {
        status: 'Locked',
        reason,
      })
      if (res.data?.id) {
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(300)
    const user = mockUsers.find((u) => u.id === id)
    if (!user) throw new Error('Không tìm thấy người dùng')
    user.status = 'locked'
    return user
  },

  async unlockUser(id: string): Promise<AdminUser> {
    try {
      const res = await http.patch<AdminUser>(`/api/v1/admin/users/${id}/status`, {
        status: 'Active',
      })
      if (res.data?.id) {
        return res.data
      }
    } catch {
      // Fallback
    }

    await delay(300)
    const user = mockUsers.find((u) => u.id === id)
    if (!user) throw new Error('Không tìm thấy người dùng')
    user.status = 'active'
    return user
  },
}
