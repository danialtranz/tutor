import type { UserLite, UserReputationSummary } from './users.type'
import type { Pagination } from '@/types/common'
export interface ReviewCreateRequest {
  rating: number
  comment?: string | null
}

export interface Review {
  id: number
  bookingId: number
  reviewer: UserLite
  rating: number
  comment?: string | null
  sessionStartTimeUtc: string
}

export interface PagedReviews extends Pagination {
  items: Review[]
}

export interface ReceivedReviewsPage extends Pagination {
  summary: UserReputationSummary
  items: Review[]
}
