export type GoalStatus = 'NotStarted' | 'InProgress' | 'Completed' | 'Cancelled'

export interface UserLite {
  id: number
  fullName: string
  role: 'Student' | 'Tutor' | 'Admin'
}

export interface Subject {
  id: number
  code: string
  name: string
  description?: string | null
  isActive: boolean
}

export interface LearningMilestone {
  id: number
  title: string
  status: GoalStatus
  targetDate?: string | null
}

export interface LearningGoal {
  id: number
  student: UserLite

  tutorSubjectId: number
  tutor?: UserLite

  subject: Subject

  title: string
  description?: string | null
  targetDate?: string | null

  status: GoalStatus

  currentProgressPercent?: number

  milestones: LearningMilestone[]
}

export interface PagedLearningGoals {
  items: LearningGoal[]

  pageNumber: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface ProgressChartPoint {
  date: string
  progressPercent: number
}

export interface ProgressChart {
  learningGoalId: number
  points: ProgressChartPoint[]
}
