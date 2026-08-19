import type { AdminUser, Complaint, ComplaintStatus, DashboardStats, Subject, TutorApplication, TutorApplicationStatus } from './admin.types'
import { http } from '@/lib/api/http'

const tutorStatus: Record<number, TutorApplicationStatus> = { 1: 'draft', 2: 'pending', 3: 'approved', 4: 'rejected', 5: 'suspended' }
const complaintStatus: Record<number, ComplaintStatus> = { 1: 'open', 2: 'in_review', 3: 'resolved', 4: 'rejected' }

function mapTutor(item: any): TutorApplication {
  return {
    id: String(item.userId), fullName: item.fullName, email: item.email, phone: item.phone ?? '',
    qualification: item.qualification ?? '', experienceYears: item.experienceYears ?? 0,
    subjects: (item.subjects ?? []).map((x: any) => x.subject?.name ?? x.subjectName).filter(Boolean),
    bio: item.bio ?? '', degrees: item.verificationDocumentUrl ? [{ name: 'Tài liệu xác minh', url: item.verificationDocumentUrl, verified: true }] : [],
    createdAt: item.submittedAtUtc ?? '', status: tutorStatus[item.approvalStatus] ?? 'draft', rejectionReason: item.reviewNote,
  }
}

function mapSubject(item: any): Subject {
  return { id: String(item.id), code: item.code, name: item.name, description: item.description ?? '', status: item.isActive ? 'active' : 'inactive' }
}

function mapComplaint(item: any): Complaint {
  return {
    id: String(item.id), complainantName: item.createdBy?.fullName ?? '', complainantRole: item.createdBy?.role === 2 ? 'tutor' : 'student',
    targetName: item.againstUser?.fullName ?? '', type: item.type, content: item.description ?? '', evidenceUrl: item.evidenceUrl,
    status: complaintStatus[item.status] ?? 'open', createdAt: item.submittedAtUtc ?? '', resolutionNotes: item.adminResponse, resolvedAt: item.resolvedAtUtc,
  }
}

export const adminApi = {
  async getDashboardStats(params?: { fromUtc?: string; toUtc?: string }): Promise<DashboardStats> {
    const { data } = await http.get<DashboardStats>('/api/v1/admin/dashboard', { params })
    return data
  },

  async getTutorApplications(params?: { status?: TutorApplicationStatus | 'all'; query?: string }): Promise<TutorApplication[]> {
    const { data } = await http.get<any[]>('/api/v1/admin/tutors', { params: { status: params?.status !== 'all' ? params?.status : undefined } })
    const applications = data.map(mapTutor)
    const search = params?.query?.trim().toLowerCase()
    return search ? applications.filter((item) => `${item.fullName} ${item.email} ${item.qualification}`.toLowerCase().includes(search)) : applications
  },

  async getTutorApplicationDetail(id: string): Promise<TutorApplication> {
    const { data } = await http.get<any>(`/api/v1/admin/tutors/${id}`)
    return mapTutor(data)
  },

  async reviewTutorApplication(id: string, status: 'approved' | 'rejected', reviewNote?: string): Promise<TutorApplication> {
    const { data } = await http.put<any>(`/api/v1/admin/tutors/${id}/approval`, { status: status === 'approved' ? 'Approved' : 'Rejected', reviewNote })
    return mapTutor(data)
  },

  async getSubjects(query?: string): Promise<Subject[]> {
    const { data } = await http.get<any[]>('/api/v1/subjects', { params: { includeInactive: true } })
    const subjects = data.map(mapSubject)
    const keyword = query?.trim().toLowerCase()
    return keyword ? subjects.filter((item) => `${item.code} ${item.name}`.toLowerCase().includes(keyword)) : subjects
  },

  async createSubject(input: Pick<Subject, 'code' | 'name' | 'description'>): Promise<Subject> {
    const { data } = await http.post<any>('/api/v1/subjects', input)
    return mapSubject(data)
  },

  async updateSubject(id: string, input: Partial<Pick<Subject, 'code' | 'name' | 'description'>>): Promise<Subject> {
    const { data } = await http.put<any>(`/api/v1/subjects/${id}`, input)
    return mapSubject(data)
  },

  async deleteSubject(id: string): Promise<void> {
    await http.put(`/api/v1/subjects/${id}/status`, { isActive: false })
  },

  async setSubjectStatus(id: string, isActive: boolean): Promise<Subject> {
    const { data } = await http.put<any>(`/api/v1/subjects/${id}/status`, { isActive })
    return mapSubject(data)
  },

  async getComplaints(status?: ComplaintStatus | 'all'): Promise<Complaint[]> {
    const { data } = await http.get<{ items: any[] }>('/api/v1/admin/complaints', { params: { status: status !== 'all' ? status : undefined } })
    return data.items.map(mapComplaint)
  },

  async getComplaintDetail(id: string): Promise<Complaint> {
    const { data } = await http.get<any>(`/api/v1/admin/complaints/${id}`)
    return mapComplaint(data)
  },

  async resolveComplaint(id: string, status: 'in_review' | 'resolved' | 'rejected', adminResponse?: string): Promise<Complaint> {
    const contractStatus = status === 'in_review' ? 'InReview' : status === 'resolved' ? 'Resolved' : 'Rejected'
    const { data } = await http.patch<any>(`/api/v1/admin/complaints/${id}`, { status: contractStatus, adminResponse })
    return mapComplaint(data)
  },

  async getUsers(params?: string | { search?: string; role?: number; status?: number; pageNumber?: number; pageSize?: number }): Promise<AdminUser[]> {
    const query = typeof params === 'string' ? { search: params } : params
    const { data } = await http.get<{ items: any[] }>('/api/v1/admin/users', { params: query })
    return data.items.map((item) => ({ id: String(item.id), name: item.fullName, email: item.email, role: item.role === 1 ? 'admin' : item.role === 2 ? 'tutor' : 'student', status: item.status === 2 ? 'locked' : 'active' }))
  },

  async lockUser(id: string, _reason?: string): Promise<AdminUser> {
    const { data } = await http.patch<any>(`/api/v1/admin/users/${id}/status`, { status: 2 })
    return { id: String(data.id), name: data.fullName, email: data.email, role: data.role === 1 ? 'admin' : data.role === 2 ? 'tutor' : 'student', status: 'locked' }
  },

  async unlockUser(id: string): Promise<AdminUser> {
    const { data } = await http.patch<any>(`/api/v1/admin/users/${id}/status`, { status: 1 })
    return { id: String(data.id), name: data.fullName, email: data.email, role: data.role === 1 ? 'admin' : data.role === 2 ? 'tutor' : 'student', status: 'active' }
  },
}
