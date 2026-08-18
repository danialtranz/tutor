export interface SessionProgress {
  bookingId: number
  learningGoalId: number
  score?: number | null
  maxScore?: number | null
  goalProgressPercent: number
  tutorComment: string
}
