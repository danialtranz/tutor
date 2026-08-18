export interface CurrentUser {
  userId: string
  fullName: string
  email: string
  role: 'Student' | 'Tutor' | 'Admin'
  avatarUrl?: string
  creditBalance: number
}
