'use client'
import { Toaster, toast } from 'react-hot-toast'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  Calendar,
  Loader2,
  Target,
  Clock,
  Video,
  XCircle,
  RefreshCw,
  Star,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react'
import { useParams } from 'react-router-dom'
import type {
  LearningGoal,
  Milestone,
  CreateLearningGoalRequest,
  CreateMilestoneRequest,
  UpdateMilestoneRequest,
  UpdateLearningGoalRequest,
} from '../types/learningGoal.types'
import type { Booking } from '../types/booking.types'
import type { CreateReviewRequest, Review } from '../types/review.types'
import { studentApi } from '../api/studentApi'
import { useCurrentUser } from '../hooks/useCurrentUser'
import type { TutorDetail } from '../types/tutor.types'
import RescheduleTab from '../components/scheduleDetailTab/RescheduleTab'
import CancelBookingTab from '../components/scheduleDetailTab/CancelBookingTab'
import ReviewTab from '../components/scheduleDetailTab/ReviewTab'
import ComplaintTab from '../components/scheduleDetailTab/ComplaintTab'
import LearningProgressTab from '../components/scheduleDetailTab/LearningProgressTab'
import type { Complaint } from '../types/complaint.type'
import { BookingStatus, RescheduleRequestStatus } from '@/constants/enums'

type ActionTab = 'progress' | 'reschedule' | 'cancel' | 'review' | 'complaint'

export default function StudentProgressPage() {
  const { scheduleId: bookingIdParam } = useParams<{ scheduleId: string }>()
  const { data: currentUser } = useCurrentUser()

  const [activeBookingId, setActiveBookingId] = useState<string>(bookingIdParam || '0')

  const [booking, setBooking] = useState<Booking | any>(null)
  const [loadingSchedule, setLoadingSchedule] = useState<boolean>(false)
  const [submittingSchedule, setSubmittingSchedule] = useState<boolean>(false)

  // Sub-Tab Thao Tác
  const [activeActionTab, setActiveActionTab] = useState<ActionTab>('progress')
  // 1. Hàm cập nhật Goal (Mục tiêu)
  const handleUpdateGoal = async (goalId: number, data: UpdateLearningGoalRequest) => {
    try {
      const updatedGoal = await studentApi.updateLearningGoal(goalId, data)

      // Cập nhật selectedGoal
      setSelectedGoal((prev) => {
        if (!prev || prev.id !== goalId) return prev
        return {
          ...prev,
          ...updatedGoal,
          milestones: prev.milestones, // Giữ lại danh sách milestones hiện tại
        }
      })

      // Cập nhật lại danh sách goals tổng
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, ...updatedGoal } : g)),
      )
    } catch (error) {
      console.error('Lỗi khi cập nhật mục tiêu:', error)
    }
  }

  // 2. Hàm cập nhật Milestone (Cột mốc)
  const handleUpdateMilestone = async (
    milestoneId: number,
    data: UpdateMilestoneRequest,
  ) => {
    if (!selectedGoal) return
    try {
      const updatedMilestone = await studentApi.updateMilestone(
        selectedGoal.id,
        milestoneId,
        data,
      )

      // Cập nhật milestone trong selectedGoal
      setSelectedGoal((prev) => {
        if (!prev) return null
        return {
          ...prev,
          milestones: prev.milestones?.map((m) =>
            m.id === milestoneId ? updatedMilestone : m,
          ),
        }
      })

      // Cập nhật milestone trong danh sách goals tổng
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id === selectedGoal.id) {
            return {
              ...g,
              milestones: g.milestones?.map((m) =>
                m.id === milestoneId ? updatedMilestone : m,
              ),
            }
          }
          return g
        }),
      )
    } catch (error) {
      console.error('Lỗi khi cập nhật cột mốc:', error)
    }
  }
  // Forms các Sub-Tab
  const [cancelReason, setCancelReason] = useState('')
  const [rescheduleData, setRescheduleData] = useState({
    proposedStartTimeUtc: '',
    proposedEndTimeUtc: '',
    reason: '',
  })
  const [complaintType, setComplaintType] = useState<string>('NoShow')
  const [complaintDescription, setComplaintDescription] = useState('')
  const [complaintEvidenceUrl, setComplaintEvidenceUrl] = useState('')

  // States Review
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [reviewComment, setReviewComment] = useState('')
  const [myExistingReview, setMyExistingReview] = useState<Review | null>(null)
  const [tutorReview, setTutorReview] = useState<Review | null>(null)
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false)

  // ==========================================
  // STATE & LOGIC: GOALS / MILESTONES
  // ==========================================
  const [goals, setGoals] = useState<LearningGoal[]>([])
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal | null>(null)
  const [loadingGoals, setLoadingGoals] = useState<boolean>(false)
  const [submittingGoal, setSubmittingGoal] = useState<boolean>(false)
  const [submittingMilestone, setSubmittingMilestone] = useState<boolean>(false)

  // Ref khóa cờ tránh tạo trùng lặp Goal mặc định
  const isCreatingDefaultRef = useRef<boolean>(false)

  const getTutorSubjectId = (item: any): number => {
    return Number(item?.tutorSubjectId ?? item?.tutorSubject?.id ?? 0)
  }
  const currentTutorSubjectId = getTutorSubjectId(booking)

  const bookingGoals = goals.filter(
    (goal) =>
      getTutorSubjectId(goal) === currentTutorSubjectId && currentTutorSubjectId !== 0,
  )
  const tutorId = selectedGoal?.tutor?.id
  const [tutorDetail, setTutorDetail] = useState<TutorDetail | null>(null)

  const [goalForm, setGoalForm] = useState<CreateLearningGoalRequest>({
    studentId: currentUser?.id || 1,
    tutorSubjectId: 0,
    title: '',
    description: '',
    targetDate: '',
  })

  const [milestoneForm, setMilestoneForm] = useState<CreateMilestoneRequest>({
    title: '',
    description: '',
    targetDate: '',
    orderNumber: 1,
  })

  const pendingProposal =
    booking?.rescheduleProposals?.find(
      (p: any) => p.status === 'Pending' || p.status === 0,
    ) ||
    booking?.pendingRescheduleProposal ||
    null

  const checkedBookingRef = useRef<string | null>(null)

  const fetchBookingReviews = useCallback(async () => {
    if (!activeBookingId || activeBookingId === '0' || !currentUser?.id) return

    try {
      setLoadingReviews(true)
      const bookingIdStr = String(activeBookingId)
      const currentUserIdStr = String(currentUser.id)
      const tutorUserIdStr = tutorDetail?.userId ? String(tutorDetail.userId) : null

      let myRev = null
      let tutorRev = null

      if (tutorUserIdStr) {
        const tutorReviewsRes = await studentApi.getUserReviews(
          Number(tutorUserIdStr),
          1,
          20,
        )
        myRev = (tutorReviewsRes?.items || []).find(
          (item: any) =>
            String(item.bookingId) === bookingIdStr &&
            (String(item.reviewer?.id) === currentUserIdStr ||
              String(item.reviewerId) === currentUserIdStr),
        )
      }

      const myReceivedReviewsRes = await studentApi.getUserReviews(
        Number(currentUserIdStr),
        1,
        20,
      )
      tutorRev = (myReceivedReviewsRes?.items || []).find(
        (item: any) =>
          String(item.bookingId) === bookingIdStr &&
          String(item.reviewer?.id) !== currentUserIdStr,
      )

      setMyExistingReview(myRev || null)
      setTutorReview(tutorRev || null)

      checkedBookingRef.current = activeBookingId
    } catch (error) {
      console.error('Lỗi khi kiểm tra đánh giá:', error)
    } finally {
      setLoadingReviews(false)
    }
  }, [activeBookingId, currentUser?.id, tutorDetail?.userId])

  const fetchMyGoals = useCallback(async () => {
    try {
      setLoadingGoals(true)
      const res = (await studentApi.getMyGoals()) as any
      const data: LearningGoal[] = res?.data || res || []
      setGoals(data)

      const targetSubjectId = getTutorSubjectId(booking)

      if (targetSubjectId && targetSubjectId !== 0) {
        const freshBookingGoals = data.filter(
          (goal) => getTutorSubjectId(goal) === targetSubjectId,
        )

        // TỰ ĐỘNG TẠO MỤC TIÊU MẶC ĐỊNH NẾU CHƯA CÓ MỤC TIÊU NÀO CHO MÔN HỌC NÀY
        if (
          freshBookingGoals.length === 0 &&
          currentUser?.id &&
          !isCreatingDefaultRef.current
        ) {
          isCreatingDefaultRef.current = true

          const defaultTargetDate = new Date()
          defaultTargetDate.setDate(defaultTargetDate.getDate() + 30)

          const defaultGoalPayload: CreateLearningGoalRequest = {
            studentId: currentUser.id,
            tutorSubjectId: targetSubjectId,
            title: `Mục tiêu học tập cho booking - ${booking?.id || booking?.subject || 'Môn học'}`,
            description: 'Mục tiêu học tập được tạo tự động cho môn học này.',
            targetDate: defaultTargetDate.toISOString().split('T')[0] ?? '',
          }

          try {
            if (
              booking.status === BookingStatus.Confirmed ||
              booking.status === BookingStatus.Completed
            ) {
              await studentApi.createLearningGoal(defaultGoalPayload)
            }
            const reFetchRes = (await studentApi.getMyGoals()) as any
            const reFetchData: LearningGoal[] = reFetchRes?.data || reFetchRes || []
            setGoals(reFetchData)

            const updatedBookingGoals = reFetchData.filter(
              (goal) => getTutorSubjectId(goal) === targetSubjectId,
            )
            if (updatedBookingGoals.length > 0) {
              setSelectedGoal(updatedBookingGoals[0] ?? null)
            }
          } catch (createErr) {
            console.error('Tự động tạo Goal mặc định thất bại:', createErr)
          } finally {
            isCreatingDefaultRef.current = false
          }
        } else if (freshBookingGoals.length > 0) {
          setSelectedGoal((prev) => {
            const stillValid = freshBookingGoals.find((goal) => goal.id === prev?.id)
            return stillValid ?? freshBookingGoals[0] ?? null
          })
        } else {
          setSelectedGoal(null)
        }
      } else {
        setSelectedGoal(null)
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách mục tiêu:', error)
    } finally {
      setLoadingGoals(false)
    }
  }, [booking, currentUser?.id])

  const fetchScheduleDetail = useCallback(
    async (id: string) => {
      if (!id || id === '0') return

      try {
        setLoadingSchedule(true)
        const res = (await studentApi.getBookingDetail(id)) as any
        const bookingData: Booking = res?.data || res
        setBooking(bookingData)

        const tutorSubjectId = getTutorSubjectId(bookingData)
        setSelectedGoal(null)
        setGoalForm((prev) => ({
          ...prev,
          studentId: currentUser?.id || 0,
          tutorSubjectId: Number(tutorSubjectId),
        }))
      } catch (err) {
        console.error('Lỗi khi tải chi tiết lịch hẹn:', err)
        setBooking(null)
      } finally {
        setLoadingSchedule(false)
      }
    },
    [currentUser?.id],
  )

  useEffect(() => {
    fetchScheduleDetail(activeBookingId)
  }, [activeBookingId, fetchScheduleDetail])

  useEffect(() => {
    if (checkedBookingRef.current !== activeBookingId) {
      setMyExistingReview(null)
      setTutorReview(null)
    }
  }, [activeBookingId])

  useEffect(() => {
    if (
      activeActionTab === 'review' &&
      checkedBookingRef.current !== activeBookingId &&
      currentUser?.id
    ) {
      fetchBookingReviews()
    }
  }, [activeActionTab, activeBookingId, currentUser?.id, fetchBookingReviews])

  useEffect(() => {
    if (booking) {
      fetchMyGoals()
    }
  }, [booking, fetchMyGoals])

  useEffect(() => {
    if (bookingIdParam && bookingIdParam !== activeBookingId) {
      setActiveBookingId(bookingIdParam)
    }
  }, [bookingIdParam, activeBookingId])

  useEffect(() => {
    const fetchTutorDetail = async () => {
      if (!tutorId) {
        setTutorDetail(null)
        return
      }

      try {
        const tutor = await studentApi.getTutorById(Number(tutorId))
        setTutorDetail(tutor)
      } catch (error) {
        console.error('Lỗi khi lấy tutor detail:', error)
      }
    }

    fetchTutorDetail()
  }, [tutorId])

  const isScheduleCompleted =
    booking?.status === 'Completed' ||
    booking?.status === 5 ||
    String(booking?.status).toLowerCase() === 'completed'

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleSelectGoal = async (id: number) => {
    try {
      setLoadingGoals(true)
      const res = (await studentApi.getLearningGoalById(id)) as any
      const detail: LearningGoal = res?.data || res
      setSelectedGoal(detail)
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết mục tiêu:', error)
    } finally {
      setLoadingGoals(false)
    }
  }

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goalForm.title.trim() || !currentUser?.id) return

    const tutorSubjectId = getTutorSubjectId(booking)
    if (!tutorSubjectId) {
      toast.error('Không tìm thấy môn học của buổi học này.')
      return
    }

    try {
      setSubmittingGoal(true)
      await studentApi.createLearningGoal({
        ...goalForm,
        studentId: currentUser.id,
        tutorSubjectId,
      })

      setGoalForm({
        studentId: currentUser.id,
        tutorSubjectId,
        title: '',
        description: '',
        targetDate: '',
      })

      await fetchMyGoals()
      toast.success('Tạo mục tiêu thành công!')
    } catch (error) {
      console.error('Tạo Goal thất bại:', error)
      toast.error('Tạo mục tiêu thất bại.')
    } finally {
      setSubmittingGoal(false)
    }
  }

  const handleToggleMilestoneStatus = async (milestone: Milestone) => {
    if (!selectedGoal) return
    const newStatus = milestone.status === 2 ? 0 : 2

    try {
      setSelectedGoal((prev) => {
        if (!prev) return null
        return {
          ...prev,
          milestones: prev.milestones?.map((m) =>
            m.id === milestone.id ? { ...m, status: newStatus } : m,
          ),
        }
      })

      await studentApi.updateMilestoneStatus(selectedGoal.id, milestone.id, {
        status: newStatus,
      })
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái milestone:', error)
      handleSelectGoal(selectedGoal.id)
    }
  }

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGoal || !milestoneForm.title.trim() || !milestoneForm.targetDate) return

    const milestones = selectedGoal.milestones ?? []
    const nextOrderNumber =
      milestones.length > 0 ? Math.max(...milestones.map((m) => m.orderNumber)) + 1 : 1

    try {
      setSubmittingMilestone(true)
      await studentApi.createMilestone(selectedGoal.id, {
        title: milestoneForm.title.trim(),
        description: milestoneForm.description.trim(),
        targetDate: milestoneForm.targetDate,
        orderNumber: nextOrderNumber,
      })

      setMilestoneForm({
        title: '',
        description: '',
        targetDate: '',
        orderNumber: nextOrderNumber + 1,
      })

      await handleSelectGoal(selectedGoal.id)
      toast.success('Thêm cột mốc thành công!')
    } catch (error) {
      console.error('Tạo Milestone thất bại:', error)
      toast.error('Thêm cột mốc thất bại.')
    } finally {
      setSubmittingMilestone(false)
    }
  }

  const handleDeleteMilestone = async (id: number) => {
    if (!selectedGoal || !window.confirm('Bạn có chắc chắn muốn xóa cột mốc này?')) return

    try {
      await studentApi.deleteMilestone(selectedGoal.id, id)
      handleSelectGoal(selectedGoal.id)
      toast.success('Đã xóa cột mốc.')
    } catch (error) {
      console.error('Xóa Milestone thất bại:', error)
      toast.error('Xóa cột mốc thất bại.')
    }
  }

  const calculateProgress = (milestones: Milestone[] = []) => {
    if (!milestones || milestones.length === 0) return 0
    const completed = milestones.filter((m) => m.status === 2).length
    return Math.round((completed / milestones.length) * 100)
  }

  const createReviewMutation = useMutation({
    mutationFn: (data: CreateReviewRequest) =>
      studentApi.createReview(Number(activeBookingId), data),
    onSuccess: (newReview) => {
      toast.success('Gửi đánh giá thành công! Cảm ơn bạn đã phản hồi.')
      setMyExistingReview(newReview)
      setReviewComment('')
      setRating(5)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá.')
    },
  })

  const [myComplaint, setMyComplaint] = useState<Complaint | null>(null)
  const [againstMeComplaint, setAgainstMeComplaint] = useState<Complaint | null>(null)
  const [loadingComplaint, setLoadingComplaint] = useState<boolean>(false)
  const checkedComplaintBookingRef = useRef<string | null>(null)

  const checkComplaintStatus = useCallback(async () => {
    if (!activeBookingId || !currentUser?.id) return

    try {
      setLoadingComplaint(true)
      const result = await studentApi.checkBookingComplaintStatus(
        activeBookingId,
        currentUser.id,
      )

      setMyComplaint(result.myComplaint || null)
      setAgainstMeComplaint(result.againstMeComplaint || null)
      checkedComplaintBookingRef.current = activeBookingId
    } catch (err) {
      console.error('Lỗi khi lấy thông tin khiếu nại:', err)
    } finally {
      setLoadingComplaint(false)
    }
  }, [activeBookingId, currentUser?.id])

  useEffect(() => {
    if (checkedComplaintBookingRef.current !== activeBookingId) {
      setMyComplaint(null)
      setAgainstMeComplaint(null)
    }
  }, [activeBookingId])

  useEffect(() => {
    if (activeActionTab === 'complaint') {
      checkComplaintStatus()
    }
  }, [activeActionTab, checkComplaintStatus])

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating || rating < 1 || rating > 5)
      return toast.error('Vui lòng chọn từ 1 - 5 sao.')
    if (!reviewComment.trim()) return toast.error('Vui lòng nhập nhận xét của bạn.')
    createReviewMutation.mutate({ rating, comment: reviewComment.trim() })
  }

  const createComplaintMutation = useMutation({
    mutationFn: studentApi.createComplaint,
    onSuccess: () => {
      toast.success('Gửi khiếu nại thành công! Admin sẽ tiến hành kiểm tra.')
      setComplaintType('NoShow')
      setComplaintDescription('')
      setComplaintEvidenceUrl('')
      checkComplaintStatus()
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo khiếu nại.')
    },
  })

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault()

    const againstUserId = tutorDetail?.userId
    if (!againstUserId)
      return toast.error('Không tìm thấy thông tin Gia sư để khiếu nại!')
    if (!complaintDescription.trim())
      return toast.error('Vui lòng nhập mô tả chi tiết sự cố!')

    createComplaintMutation.mutate({
      againstUserId: Number(againstUserId),
      bookingId: Number(activeBookingId),
      type: complaintType,
      description: complaintDescription,
      evidenceUrl: complaintEvidenceUrl.trim() || undefined,
    })
  }

  const handleCancelBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cancelReason.trim()) {
      return toast.error('Vui lòng nhập lý do hủy')
    }

    try {
      setSubmittingSchedule(true)

      await studentApi.cancelBooking(activeBookingId, {
        reason: cancelReason,
      })

      toast.success('Đã hủy lịch hẹn thành công')

      await fetchScheduleDetail(activeBookingId)
    } catch (error: any) {
      console.error('Cancel booking error:', error)

      const status = error?.response?.status
      const message = getApiErrorMessage(error)

      toast.error(status ? `${status}: ${message}` : message)
    } finally {
      setSubmittingSchedule(false)
    }
  }
  const getApiErrorMessage = (error: any): string => {
    const data = error?.response?.data

    // BE trả string trực tiếp
    if (typeof data === 'string') {
      return data
    }

    // Các format message phổ biến
    if (data?.message) {
      return data.message
    }

    if (data?.error) {
      return typeof data.error === 'string' ? data.error : JSON.stringify(data.error)
    }

    if (data?.title) {
      return data.title
    }

    // ASP.NET Core ValidationProblemDetails
    if (data?.errors) {
      const errors = Object.values(data.errors).flat()

      if (errors.length > 0) {
        return errors.join(', ')
      }
    }

    // Axios error message
    if (error?.message) {
      return error.message
    }

    return 'Đã xảy ra lỗi. Vui lòng thử lại.'
  }
  const handleRescheduleBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSubmittingSchedule(true)

      await studentApi.requestReschedule(activeBookingId, rescheduleData)

      toast.success('Gửi yêu cầu dời lịch thành công!')

      // Load lại booking để cập nhật pendingProposal
      await fetchScheduleDetail(activeBookingId)

      // Reset form
      setRescheduleData({
        proposedStartTimeUtc: '',
        proposedEndTimeUtc: '',
        reason: '',
      })
    } catch (error: any) {
      console.error('Reschedule error:', error)

      const status = error?.response?.status
      const message = getApiErrorMessage(error)

      // Ví dụ:
      // 400: Thời gian đề xuất không hợp lệ
      // 404: Không tìm thấy booking
      // 409: Đã có yêu cầu dời lịch đang chờ xử lý
      // 500: Internal Server Error
      toast.error(status ? `${status}: ${message}` : message)
    } finally {
      setSubmittingSchedule(false)
    }
  }

  const handleUpdateProposalStatus = async (
    proposalId: number | string,
    status: number,
    responseNote: string,
  ) => {
    try {
      setSubmittingSchedule(true)

      await studentApi.updateRescheduleStatus(activeBookingId, proposalId, {
        status,
        responseNote,
      })

      toast.success(
        status === RescheduleRequestStatus.Accepted
          ? 'Đã chấp nhận dời lịch!'
          : 'Đã từ chối yêu cầu dời lịch!',
      )

      await fetchScheduleDetail(activeBookingId)
    } catch (error: any) {
      console.error('Update reschedule status error:', error)

      const statusCode = error?.response?.status
      const message = getApiErrorMessage(error)

      toast.error(statusCode ? `${statusCode}: ${message}` : message)
    } finally {
      setSubmittingSchedule(false)
    }
  }

  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'N/A'
    return new Date(isoString).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* HEADER PAGE */}
      <Toaster position="top-right" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">
            Chi Tiết Lịch Học & Tiến Độ
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Quản lý mục tiêu, dời lịch, hủy lịch và đánh giá cho từng buổi học.
          </p>
        </div>
      </div>

      {loadingSchedule ? (
        <div className="flex h-80 flex-col items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p>Đang tải thông tin lịch hẹn #{activeBookingId}...</p>
        </div>
      ) : !booking ? (
        <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center text-sm text-gray-400 dark:border-gray-800 dark:text-gray-600">
          Không tìm thấy thông tin lịch hẹn #{activeBookingId}. Vui lòng thử mã khác.
        </div>
      ) : (
        <>
          {/* THÔNG TIN TỔNG QUAN BUỔI HỌC */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                {/* <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {booking?.subjectName || booking?.subject || 'Môn học'}
                </span> */}
                {/* <h1 className="mt-1 text-xl font-black text-gray-900 dark:text-gray-100">
                  Buổi học với Gia sư:{' '}
                  {tutorDetail?.fullName || booking?.tutorName || 'Gia sư'}
                </h1> */}
                <h1 className="mt-1 text-xl font-black text-gray-900 dark:text-gray-100">
                  Buổi học: #{booking?.id}
                </h1>
              </div>
            </div>

            {/* Grid Thời Gian & Phòng Học */}
            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Bắt đầu</p>
                  <p className="truncate text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {formatDateTime(booking?.startTimeUtc || booking?.startTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Kết thúc</p>
                  <p className="truncate text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {formatDateTime(booking?.endTimeUtc || booking?.endTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Video className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Phòng học</p>
                  {booking?.meetingUrl ? (
                    <a
                      href={booking.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Vào lớp ngay <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="text-xs font-semibold text-gray-500">
                      Chưa cập nhật link
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CARD TÁC VỤ */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
            {/* THANH CHUYỂN TAB */}
            <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
              <button
                onClick={() => setActiveActionTab('progress')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  activeActionTab === 'progress'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Target className="h-4 w-4" /> Tiến Độ & Cột Mốc
              </button>

              <button
                onClick={() => setActiveActionTab('reschedule')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  activeActionTab === 'reschedule'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <RefreshCw className="h-4 w-4" /> Dời Lịch Học
              </button>

              <button
                onClick={() => setActiveActionTab('cancel')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  activeActionTab === 'cancel'
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <XCircle className="h-4 w-4" /> Hủy Buổi Học
              </button>

              {isScheduleCompleted && (
                <button
                  onClick={() => setActiveActionTab('review')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    activeActionTab === 'review'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Star className="h-4 w-4" /> Đánh Giá Gia Sư
                </button>
              )}

              <button
                onClick={() => setActiveActionTab('complaint')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  activeActionTab === 'complaint'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <ShieldAlert className="h-4 w-4" /> Khiếu Nại Buổi Học
              </button>
            </div>

            {/* TAB 1: MỤC TIÊU & CỘT MỐC */}
            {activeActionTab === 'progress' && (
              <LearningProgressTab
                goals={goals}
                bookingGoals={bookingGoals}
                selectedGoal={selectedGoal}
                loadingGoals={loadingGoals}
                goalForm={goalForm}
                setGoalForm={setGoalForm}
                milestoneForm={milestoneForm}
                setMilestoneForm={setMilestoneForm}
                submittingGoal={submittingGoal}
                submittingMilestone={submittingMilestone}
                handleCreateGoal={handleCreateGoal}
                handleSelectGoal={handleSelectGoal}
                handleCreateMilestone={handleCreateMilestone}
                handleToggleMilestoneStatus={handleToggleMilestoneStatus}
                handleDeleteMilestone={handleDeleteMilestone}
                // THÊM 2 HÀM CẬP NHẬT Ở ĐÂY:
                handleUpdateGoal={handleUpdateGoal}
                handleUpdateMilestone={handleUpdateMilestone}
                calculateProgress={calculateProgress}
                formatDisplayDate={formatDisplayDate}
              />
            )}

            {/* TAB 2: DỜI LỊCH */}
            {activeActionTab === 'reschedule' && (
              <RescheduleTab
                bookingId={activeBookingId}
                pendingProposal={pendingProposal}
                rescheduleData={rescheduleData}
                setRescheduleData={setRescheduleData}
                submittingSchedule={submittingSchedule}
                onSubmitCreateProposal={handleRescheduleBooking}
                onUpdateProposalStatus={handleUpdateProposalStatus}
              />
            )}

            {/* TAB 3: HỦY LỊCH */}
            {activeActionTab === 'cancel' && (
              <CancelBookingTab
                cancelReason={cancelReason}
                setCancelReason={setCancelReason}
                submittingSchedule={submittingSchedule}
                onSubmit={handleCancelBooking}
                bookingStatus={booking?.status}
              />
            )}

            {/* TAB 4: ĐÁNH GIÁ */}
            {activeActionTab === 'review' && (
              <ReviewTab
                rating={rating}
                setRating={setRating}
                hoverRating={hoverRating}
                setHoverRating={setHoverRating}
                reviewComment={reviewComment}
                setReviewComment={setReviewComment}
                isSubmitting={createReviewMutation.isPending}
                onSubmit={handleCreateReview}
                myExistingReview={myExistingReview}
                tutorReview={tutorReview}
                isLoadingReviews={loadingReviews}
              />
            )}

            {/* TAB 5: KHIẾU NẠI */}
            {activeActionTab === 'complaint' && (
              <ComplaintTab
                complaintType={complaintType}
                setComplaintType={setComplaintType}
                complaintDescription={complaintDescription}
                setComplaintDescription={setComplaintDescription}
                complaintEvidenceUrl={complaintEvidenceUrl}
                setComplaintEvidenceUrl={setComplaintEvidenceUrl}
                isSubmitting={createComplaintMutation.isPending}
                onSubmit={handleCreateComplaint}
                myComplaint={myComplaint}
                againstMeComplaint={againstMeComplaint}
                isLoading={loadingComplaint}
                bookingStatus={booking?.status}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}
