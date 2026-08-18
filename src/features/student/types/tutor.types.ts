export interface MatchedAvailability {
  startTimeUtc: string
  endTimeUtc: string
}

export interface TutorSearchResult {
  tutorId: number
  fullName: string
  bio: string
  qualification: string
  experienceYears: number
  subjectId: number
  subjectName: string
  teachingLevel: string
  feePerSessionCredits: number
  averageRating: number
  reviewCount: number
  matchingScore: number
  matchedAvailability: MatchedAvailability | null
  reputationScore: number
}
