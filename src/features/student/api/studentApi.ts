import { http } from '@/lib/api/http'

import type { ApiResponse, User } from '../types/users.type'

import type {
  TutorAvailability,
  TutorDetail,
  TutorSearchResult,
} from '../types/tutor.types'

import type { Subject } from '../types/subjects.types'

import type { Booking } from '../types/booking.types'

import type {
  Complaint,
  ComplaintCreateRequest,
  PagedComplaints,
} from '../types/complaint.type'

import type {
  LearningGoal,
  Milestone,
  CreateLearningGoalRequest,
  UpdateLearningGoalRequest,
  CreateMilestoneRequest,
  UpdateMilestoneRequest,
  UpdateMilestoneStatusRequest,
} from '../types/learningGoal.types'
import type { CreateReviewRequest, Review, ReviewListData } from '../types/review.types'

export interface TutorSearchParams {
  subjectId?: number
  teachingLevel?: string
  startTimeUtc?: string
  endTimeUtc?: string
}

const BASE_URL = '/api/v1'

const LEARNING_GOAL_URL = `${BASE_URL}/learning-goals`

export const studentApi = {
  // =========================
  // USER
  // =========================

  getMe: async (): Promise<User> => {
    const response = await http.get<ApiResponse<User>>('/api/v1/users/me')

    return response.data.data
  },

  // =========================
  // TUTOR
  // =========================

  searchTutors: async (params: TutorSearchParams): Promise<TutorSearchResult[]> => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== '',
      ),
    )

    console.log('URL Params thực tế gửi BE:', cleanParams)

    const response = await http.get<{
      message: string
      data: TutorSearchResult[]
      code: number
    }>('/api/v1/tutors/search', {
      params: cleanParams,
    })

    console.log('SEARCH TUTORS RESPONSE:', response.data)

    return response.data.data
  },

  getTutorById: async (tutorId: number): Promise<TutorDetail> => {
    const response = await http.get(`/api/v1/tutors/${tutorId}`)

    console.log('TUTOR DETAIL API:', response.data)

    return response.data.data
  },

  getMyAvailabilities: async (): Promise<TutorAvailability[]> => {
    const response = await http.get<TutorAvailability[]>(
      '/api/v1/tutors/me/availabilities',
    )

    return response.data
  },

  // =========================
  // SUBJECT
  // =========================

  getSubjects: async (): Promise<Subject[]> => {
    const response = await http.get<Subject[]>('/api/v1/subjects')

    return response.data
  },

  getSubjectById: async (
    subjectId: number,
    includeInactive = false,
  ): Promise<Subject> => {
    const response = await http.get<Subject>(`/api/v1/subjects/${subjectId}`, {
      params: {
        includeInactive,
      },
    })

    return response.data
  },

  // =========================
  // BOOKING
  // =========================

  getBookings: async (): Promise<Booking[]> => {
    const response = await http.get<Booking[]>('/api/v1/bookings')

    return response.data
  },

  getBookingDetail: async (bookingId: number | string): Promise<Booking> => {
    const response = await http.get<Booking>(`/api/v1/bookings/${bookingId}`)

    console.log('BOOKING DETAIL:', response.data)

    return response.data
  },

  cancelBooking: async (
    bookingId: number | string,
    payload: {
      reason: string
    },
  ) => {
    const response = await http.post(`/api/v1/bookings/${bookingId}/cancel`, payload)

    return response.data
  },

  requestReschedule: async (
    bookingId: number | string,
    payload: {
      proposedStartTimeUtc: string
      proposedEndTimeUtc: string
      reason: string
    },
  ) => {
    const response = await http.post(`/api/v1/bookings/${bookingId}/reschedule`, payload)

    return response.data
  },

  updateRescheduleStatus: async (
    bookingId: number | string,
    proposalId: number | string,
    payload: {
      status: number
      responseNote: string
    },
  ) => {
    const response = await http.put(
      `/api/v1/bookings/${bookingId}/reschedule/${proposalId}/status`,
      payload,
    )

    return response.data
  },

  completeBooking: async (
    bookingId: number | string,
    payload: {
      learningGoalId: number
      score: number
      maxScore: number
      goalProgressPercent: number
      tutorComment: string
    },
  ) => {
    const response = await http.post(`/api/v1/bookings/${bookingId}/complete`, payload)

    return response.data
  },

  // =========================
  // COMPLAINTS
  // =========================

  getComplaints: async (params?: {
    pageNumber?: number
    pageSize?: number
    status?: number
  }): Promise<PagedComplaints> => {
    const response = await http.get('/api/v1/complaints', {
      params,
    })

    return response.data.data
  },

  getComplaintDetail: async (complaintId: number | string): Promise<Complaint> => {
    const response = await http.get(`/api/v1/complaints/${complaintId}`)

    return response.data.data
  },
  createComplaint: async (payload: ComplaintCreateRequest): Promise<Complaint> => {
    const response = await http.post('/api/v1/complaints', payload)

    return response.data.data
  },
  // =========================
  // COMPLAINTS EXTENDED
  // =========================

  // 1. Lấy danh sách Complaints do CHÍNH USER HIỆN TẠI TẠO (Student / Tutor)
  getMyCreatedComplaints: async (params?: {
    pageNumber?: number
    pageSize?: number
    status?: number
  }): Promise<PagedComplaints> => {
    // Nếu backend có endpoint riêng:
    // const response = await http.get<PagedComplaints>('/api/v1/complaints/my-created', { params })

    // Nếu backend dùng chung endpoint GET /api/v1/complaints:
    const response = await http.get<PagedComplaints>('/api/v1/complaints', {
      params: {
        ...params,
        // Một số backend yêu cầu truyền thêm flag/param để lọc
        // scope: 'created_by_me'
      },
    })
    return response.data
  },

  // 2. Lấy danh sách Complaints bị người khác khiếu nại (Nhắm vào mình)
  getMyReceivedComplaints: async (params?: {
    pageNumber?: number
    pageSize?: number
    status?: number
  }): Promise<PagedComplaints> => {
    const response = await http.get<PagedComplaints>('/api/v1/complaints/my-received', {
      params,
    })
    return response.data
  },

  // 3. Kiểm tra trạng thái khiếu nại cho 1 Booking cụ thể
  // Trả về:
  // - myComplaint: Khiếu nại do BẠN tạo cho booking này (nếu có)
  // - againstMeComplaint: Khiếu nại người khác nhắm vào BẠN cho booking này (nếu có)
  checkBookingComplaintStatus: async (
    bookingId: number | string,
    currentUserId: number | string,
  ): Promise<{
    hasMyComplaint: boolean
    hasAgainstMeComplaint: boolean
    myComplaint?: Complaint
    againstMeComplaint?: Complaint
  }> => {
    try {
      // Gọi danh sách complaint (truyền bookingId nếu backend hỗ trợ lọc theo bookingId)
      const response = await http.get<PagedComplaints>('/api/v1/complaints', {
        params: {
          bookingId,
          pageNumber: 1,
          pageSize: 50,
        },
      })

      const items = response.data?.items || []
      const bookingIdStr = String(bookingId)
      const currentUserIdStr = String(currentUserId)

      // Lọc các complaint thuộc booking này
      const bookingComplaints = items.filter(
        (item: any) => String(item.bookingId) === bookingIdStr,
      )

      // 1. Do mình tạo
      const myComplaint = bookingComplaints.find(
        (item: any) =>
          String(item.createdById || item.creatorId || item.createdBy?.id) ===
          currentUserIdStr,
      )

      // 2. Do người khác khiếu nại mình (againstUserId === currentUserId)
      const againstMeComplaint = bookingComplaints.find(
        (item: any) =>
          String(item.againstUserId || item.againstUser?.id) === currentUserIdStr,
      )

      return {
        hasMyComplaint: !!myComplaint,
        hasAgainstMeComplaint: !!againstMeComplaint,
        myComplaint,
        againstMeComplaint,
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra complaint status:', error)
      return {
        hasMyComplaint: false,
        hasAgainstMeComplaint: false,
      }
    }
  },
  // =========================
  // LEARNING GOALS
  // =========================

  // POST /api/v1/learning-goals
  createLearningGoal: async (data: CreateLearningGoalRequest): Promise<LearningGoal> => {
    const response = await http.post<ApiResponse<LearningGoal>>(LEARNING_GOAL_URL, data)

    return response.data.data
  },

  // GET /api/v1/learning-goals/me
  getMyGoals: async (): Promise<LearningGoal[]> => {
    const response = await http.get<ApiResponse<LearningGoal[]>>(
      `${LEARNING_GOAL_URL}/me`,
    )

    return response.data.data
  },

  // GET /api/v1/learning-goals/{goalId}
  getLearningGoalById: async (goalId: number): Promise<LearningGoal> => {
    const response = await http.get<ApiResponse<LearningGoal>>(
      `${LEARNING_GOAL_URL}/${goalId}`,
    )

    return response.data.data
  },

  // PUT /api/v1/learning-goals/{goalId}
  updateLearningGoal: async (
    goalId: number,
    data: UpdateLearningGoalRequest,
  ): Promise<LearningGoal> => {
    const response = await http.put<ApiResponse<LearningGoal>>(
      `${LEARNING_GOAL_URL}/${goalId}`,
      data,
    )

    return response.data.data
  },

  // DELETE /api/v1/learning-goals/{goalId}
  deleteLearningGoal: async (goalId: number): Promise<void> => {
    await http.delete(`${LEARNING_GOAL_URL}/${goalId}`)
  },

  deleteMilestone: async (goalId: number, milestoneId: number): Promise<void> => {
    await http.delete(`${LEARNING_GOAL_URL}/${goalId}/milestones/${milestoneId}`)
  },

  // POST /api/v1/learning-goals/{goalId}/milestones
  createMilestone: async (
    goalId: number,
    data: CreateMilestoneRequest,
  ): Promise<Milestone> => {
    const response = await http.post<ApiResponse<Milestone>>(
      `${LEARNING_GOAL_URL}/${goalId}/milestones`,
      data,
    )

    return response.data.data
  },

  // PUT /api/v1/learning-goals/{goalId}/milestones/{milestoneId}
  updateMilestone: async (
    goalId: number,
    milestoneId: number,
    data: UpdateMilestoneRequest,
  ): Promise<Milestone> => {
    const response = await http.put<ApiResponse<Milestone>>(
      `${LEARNING_GOAL_URL}/${goalId}/milestones/${milestoneId}`,
      data,
    )

    return response.data.data
  },

  // PATCH /api/v1/learning-goals/{goalId}/milestones/{milestoneId}/status
  updateMilestoneStatus: async (
    goalId: number,
    milestoneId: number,
    data: UpdateMilestoneStatusRequest,
  ): Promise<Milestone> => {
    const response = await http.patch<ApiResponse<Milestone>>(
      `${LEARNING_GOAL_URL}/${goalId}/milestones/${milestoneId}/status`,
      data,
    )

    return response.data.data
  },

  //Review
  createReview: async (bookingId: number, data: CreateReviewRequest): Promise<Review> => {
    const response = await http.post<ApiResponse<Review>>(
      `/api/v1/bookings/${bookingId}/reviews`,
      data,
    )

    return response.data.data
  },

  getMyReceivedReviews: async (page = 1, pageSize = 10): Promise<ReviewListData> => {
    const response = await http.get<ApiResponse<ReviewListData>>(
      '/api/v1/reviews/me/received',
      {
        params: {
          page,
          pageSize,
        },
      },
    )

    return response.data.data
  },

  getUserReviews: async (
    userId: number,
    page = 1,
    pageSize = 10,
  ): Promise<ReviewListData> => {
    const response = await http.get<ApiResponse<ReviewListData>>(
      `/api/v1/users/${userId}/reviews`,
      {
        params: {
          page,
          pageSize,
        },
      },
    )

    return response.data.data
  },
}
