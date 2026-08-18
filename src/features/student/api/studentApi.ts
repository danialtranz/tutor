import { http } from '@/lib/api/http'
import type { ApiResponse, User } from '../types/users.type'
import type { TutorSearchResult } from '../types/tutor.types'
import type { Subject } from '../types/subjects.types'
import type { Booking } from '../types/booking.types'
import type {
  Complaint,
  ComplaintCreateRequest,
  PagedComplaints,
} from '../types/complaint.type'
export interface TutorSearchParams {
  subjectId?: number
  teachingLevel?: string
  startTimeUtc?: string
  endTimeUtc?: string
}

export const studentApi = {
  // get me
  getMe: async (): Promise<User> => {
    const response = await http.get<ApiResponse<User>>('/api/v1/users/me')
    return response.data.data
  },
  // tutor
  searchTutors: async (params: TutorSearchParams): Promise<TutorSearchResult[]> => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== '',
      ),
    )

    // LOG RA CONSOLE ĐỂ KIỂM TRA TRƯỚC KHIN GỬI
    console.log(' URL Params thực tế gửi BE:', cleanParams)

    const response = await http.get<TutorSearchResult[]>('/api/v1/tutors/search', {
      params: cleanParams, // Axios sẽ tự động nối params này thành ?teachingLevel=... trên URL
    })

    return response.data
  },
  // subject
  getSubjects: async (): Promise<Subject[]> => {
    const response = await http.get<Subject[]>('/api/v1/subjects')
    return response.data
  },
  //booking
  getBookings: async (): Promise<Booking[]> => {
    const response = await http.get<Booking[]>('/api/v1/bookings')
    return response.data
  },
  // 3. Lấy chi tiết 1 booking
  getBookingDetail: async (bookingId: number | string): Promise<Booking> => {
    const response = await http.get<Booking>(`/api/v1/bookings/${bookingId}`)

    console.log('BOOKING DETAIL:', response.data)

    return response.data
  },

  // 4. Gia sư xác nhận booking
  confirmBooking: async (bookingId: number | string, payload: { meetingUrl: string }) => {
    const response = await http.put(`/api/v1/bookings/${bookingId}/confirm`, payload)
    return response.data
  },

  // 5. Gia sư từ chối booking
  rejectBooking: async (bookingId: number | string, payload: { reason: string }) => {
    const response = await http.put(`/api/v1/bookings/${bookingId}/reject`, payload)
    return response.data
  },

  // 6. Hủy booking (Học sinh hoặc Gia sư)
  cancelBooking: async (bookingId: number | string, payload: { reason: string }) => {
    const response = await http.post(`/api/v1/bookings/${bookingId}/cancel`, payload)
    return response.data
  },

  // 7. Cập nhật Link Google Meet
  updateMeetingUrl: async (
    bookingId: number | string,
    payload: { meetingUrl: string },
  ) => {
    const response = await http.put(`/api/v1/bookings/${bookingId}/meeting-url`, payload)
    return response.data
  },

  // 8. Đề xuất dời lịch
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

  // 9. Phản hồi đề xuất dời lịch
  updateRescheduleStatus: async (
    bookingId: number | string,
    proposalId: number | string,
    payload: { status: number; responseNote: string },
  ) => {
    const response = await http.put(
      `/api/v1/bookings/${bookingId}/reschedule/${proposalId}/status`,
      payload,
    )
    return response.data
  },

  // 10. Hoàn thành & Chấm điểm buổi học
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

  // GET /api/v1/complaints
  getComplaints: async (params?: {
    pageNumber?: number
    pageSize?: number
    status?: number
  }): Promise<PagedComplaints> => {
    const response = await http.get<PagedComplaints>('/api/v1/complaints', {
      params,
    })

    return response.data
  },

  // GET /api/v1/complaints/{complaintId}
  getComplaintDetail: async (complaintId: number | string): Promise<Complaint> => {
    const response = await http.get<Complaint>(`/api/v1/complaints/${complaintId}`)

    return response.data
  },

  // POST /api/v1/complaints
  createComplaint: async (payload: ComplaintCreateRequest): Promise<Complaint> => {
    const response = await http.post<Complaint>('/api/v1/complaints', payload)

    return response.data
  },
}
