import { describe, it, expect } from 'vitest'
import { adminApi } from './admin.api'

describe('adminApi', () => {
  it('fetches dashboard stats', async () => {
    const stats = await adminApi.getDashboardStats()
    expect(stats.totalStudents).toBeGreaterThan(0)
    expect(stats.totalTutors).toBeGreaterThan(0)
    expect(stats.chartData.length).toBe(6)
  })

  it('fetches and reviews tutor applications', async () => {
    const apps = await adminApi.getTutorApplications({ status: 'pending' })
    expect(apps.length).toBeGreaterThan(0)
    if (!apps.length) throw new Error('No tutor applications available')
    const target = apps[0]
    if (!target) throw new Error('Missing tutor application')

    const reviewed = await adminApi.reviewTutorApplication(target.id, 'approved')
    expect(reviewed.status).toBe('approved')
  })

  it('manages subjects (CRUD)', async () => {
    const newSubject = await adminApi.createSubject({
      code: 'TEST-101',
      name: 'Môn học Thử nghiệm',
      category: 'Khoa học Tự nhiên',
      description: 'Mô tả thử nghiệm',
      status: 'active',
    })
    expect(newSubject.id).toBeDefined()

    const updated = await adminApi.updateSubject(newSubject.id, { name: 'Môn học Đã cập nhật' })
    expect(updated.name).toBe('Môn học Đã cập nhật')

    await adminApi.deleteSubject(newSubject.id)
    const subjects = await adminApi.getSubjects()
    expect(subjects.find((s) => s.id === newSubject.id)).toBeUndefined()
  })

  it('handles complaint resolutions', async () => {
    const complaints = await adminApi.getComplaints()
    expect(complaints.length).toBeGreaterThan(0)
    if (!complaints.length) throw new Error('No complaints available')
    const complaint = complaints[0]
    if (!complaint) throw new Error('Missing complaint')

    const resolved = await adminApi.resolveComplaint(complaint.id, 'resolved', 'Đã xử lý thỏa đáng')
    expect(resolved.status).toBe('resolved')
    expect(resolved.resolutionNotes).toBe('Đã xử lý thỏa đáng')
  })
})
