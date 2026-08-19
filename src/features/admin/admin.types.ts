export type TutorApplicationStatus = 'pending' | 'approved' | 'rejected'
export type SubjectStatus = 'active' | 'inactive'
export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected'

export interface DashboardStats {
  totalTutors: number
  totalStudents: number
  pendingTutorApplications: number
  openComplaints: number
  totalClassesBooked: number
  monthlyRevenue: number
  monthlyGrowthPercent: number
  chartData: { month: string; applications: number; bookings: number }[]
}

export interface TutorApplication {
  id: string
  fullName: string
  email: string
  phone: string
  avatar?: string
  qualification: string
  experienceYears: number
  subjects: string[]
  bio: string
  degrees: { name: string; url: string; verified: boolean }[]
  createdAt: string
  status: TutorApplicationStatus
  rejectionReason?: string
}

export interface Subject {
  id: string
  code: string
  name: string
  category: string
  description: string
  status: SubjectStatus
  tutorCount: number
}

export interface Complaint {
  id: string
  complainantName: string
  complainantRole: 'student' | 'tutor'
  targetName: string
  title: string
  content: string
  status: ComplaintStatus
  createdAt: string
  resolutionNotes?: string
  resolvedAt?: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'student' | 'tutor' | 'admin'
  status: 'active' | 'locked'
}
