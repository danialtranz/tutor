import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Toaster, toast } from 'react-hot-toast'
import {
  ArrowLeft,
  Star,
  Clock,
  ShieldCheck,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
  CheckCircle2,
  BookOpen,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import type { TutorDetail, TutorSubject } from '../types/tutor.types'
import { studentApi } from '../api/studentApi'
import type { CreateBookingRequest } from '../types/booking.types'

// Interface Khung giờ rảnh của Gia sư
interface TutorAvailabilitySlot {
  id: number
  dayOfWeek: number // 1: Thứ 2, 2: Thứ 3, ..., 6: Thứ 7, 0 hoặc 7: Chủ Nhật
  startTime: string // "18:00"
  endTime: string // "20:00"
}

export default function StudentTutorDetailPage() {
  const { tutorId } = useParams<{ tutorId: string }>()
  const navigate = useNavigate()
  const numericTutorId = Number(tutorId)

  // --- State quản lý Tuần đang xem ---
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0)

  // State Môn học đang chọn & Slot đang chọn để Đặt lịch
  const [selectedTutorSubjectId, setSelectedTutorSubjectId] = useState<number>(0)
  const [selectedBookingItem, setSelectedBookingItem] = useState<{
    slot: TutorAvailabilitySlot
    dateStr: string // "YYYY-MM-DD"
    displayDate: string // "20/08/2026"
  } | null>(null)

  const [studentNote, setStudentNote] = useState<string>('')

  // 1. Lấy thông tin gia sư
  const {
    data: tutor,
    isLoading,
    isError,
  } = useQuery<TutorDetail>({
    queryKey: ['tutor-detail', numericTutorId],
    queryFn: () => studentApi.getTutorById(numericTutorId),
    enabled: !isNaN(numericTutorId) && numericTutorId > 0,
  })

  // 2. Lấy danh sách lịch rảnh hàng tuần của Gia sư
  const { data: availabilities = [] } = useQuery<TutorAvailabilitySlot[]>({
    queryKey: ['tutor-availabilities', numericTutorId],
    queryFn: async () => {
      return [
        { id: 1, dayOfWeek: 1, startTime: '08:00', endTime: '10:00' },
        { id: 2, dayOfWeek: 4, startTime: '18:00', endTime: '20:00' },
        { id: 3, dayOfWeek: 4, startTime: '20:00', endTime: '22:00' },
        { id: 4, dayOfWeek: 6, startTime: '14:00', endTime: '16:00' },
      ]
    },
    enabled: !isNaN(numericTutorId) && numericTutorId > 0,
  })

  // Danh sách các môn học active của gia sư
  const activeSubjects = useMemo(() => {
    return tutor?.subjects?.filter((s) => s.isActive) || []
  }, [tutor])

  // Tự động chọn môn học đầu tiên khi dữ liệu tải xong
  useEffect(() => {
    const firstSubject = activeSubjects[0]

    if (firstSubject && !selectedTutorSubjectId) {
      setSelectedTutorSubjectId(firstSubject.id)
    }
  }, [activeSubjects, selectedTutorSubjectId])

  // --- Tính toán danh sách 7 ngày trong Tuần đang xem ---
  const weekDays = useMemo(() => {
    const today = new Date()
    const currentDay = today.getDay()
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay

    const monday = new Date(today)
    monday.setDate(today.getDate() + distanceToMonday + currentWeekOffset * 7)

    const days = []
    const dayLabels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật']

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      const dateStr = `${year}-${month}-${day}`
      const displayDate = `${day}/${month}`

      let jsDay = date.getDay()
      let backendDayOfWeek = jsDay === 0 ? 7 : jsDay

      days.push({
        label: dayLabels[i],
        dateStr,
        displayDate,
        backendDayOfWeek,
        isPast: date < new Date(today.setHours(0, 0, 0, 0)),
      })
    }

    return days
  }, [currentWeekOffset])

  // --- Map lỗi Backend sang Tiếng Việt ---
  const handleBookingError = (err: any) => {
    const status = err?.response?.status
    const serverMessage = err?.response?.data?.message || err?.message || ''

    const cleanMessage =
      typeof serverMessage === 'string'
        ? serverMessage.replace(/^\{\s*Message\s*=\s*|\s*\}$/g, '').trim()
        : String(serverMessage)

    if (status === 401) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
      return
    }

    if (status === 400) {
      if (serverMessage.includes('End Time Before Start')) {
        toast.error('Thời gian kết thúc phải sau thời gian bắt đầu!')
      } else if (serverMessage.includes('Minimum Notice')) {
        toast.error('Cần đặt lịch trước thời gian bắt đầu tối thiểu theo quy định!')
      } else if (serverMessage.includes('Tutor Subject Not Found')) {
        toast.error('Không tìm thấy môn học đã chọn!')
      } else if (serverMessage.includes('Tutor Subject Inactive')) {
        toast.error('Môn học này hiện đang ngừng nhận lớp!')
      } else if (serverMessage.includes('Credit Cost Mismatch')) {
        toast.error('Số dư Credits của bạn không đủ để đặt lịch!')
      } else if (serverMessage.includes('Schedule Conflict')) {
        toast.error('Khung giờ này đã có người đặt hoặc bạn bị trùng lịch khác!')
      } else {
        toast.error(`Yêu cầu không hợp lệ: ${cleanMessage}`)
      }

      return
    }
    if (status === 500) {
      toast.error('Lỗi hệ thống máy chủ. Vui lòng thử lại sau!')
      return
    }

    toast.error(cleanMessage || 'Đặt lịch thất bại. Vui lòng thử lại!')
  }

  // --- Mutation Đặt Lịch ---
  const bookingMutation = useMutation({
    mutationFn: (reqData: CreateBookingRequest) => studentApi.createBooking(reqData),
    onSuccess: () => {
      toast.success('Đặt lịch thành công! Đang chờ gia sư xác nhận.')
      setSelectedBookingItem(null)
      setStudentNote('')
    },
    onError: (err) => {
      handleBookingError(err)
    },
  })

  // Đặt lịch khi bấm Xác nhận trên Modal
  const confirmBooking = () => {
    if (!selectedBookingItem || !selectedTutorSubjectId) {
      toast.error('Vui lòng chọn môn học trước khi đặt lịch!')
      return
    }

    const { dateStr, slot } = selectedBookingItem
    const startLocal = new Date(`${dateStr}T${slot.startTime}`)
    const endLocal = new Date(`${dateStr}T${slot.endTime}`)

    const bookingPayload: CreateBookingRequest = {
      tutorSubjectId: selectedTutorSubjectId,
      startTimeUtc: startLocal.toISOString(),
      endTimeUtc: endLocal.toISOString(),
      creditCost: selectedSubjectObj?.feePerSessionCredits ?? 100,
      studentNote: studentNote.trim() || undefined,
    }

    bookingMutation.mutate(bookingPayload)
  }

  const selectedSubjectObj = activeSubjects.find((s) => s.id === selectedTutorSubjectId)
  const avatarSeed = encodeURIComponent(
    `${tutor?.userId || numericTutorId}-${tutor?.fullName || 'tutor'}`,
  )
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        <p className="mt-4 text-xs font-semibold text-gray-500">
          Đang tải thông tin gia sư...
        </p>
      </div>
    )
  }

  if (isError || !tutor) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
        <h3 className="text-sm font-bold text-red-600">
          Không tìm thấy thông tin gia sư!
        </h3>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white"
        >
          <ArrowLeft className="mr-1 inline h-4 w-4" /> Quay lại
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Toaster position="top-right" />

      {/* Button Quay lại */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
        </button>
      </div>

      {/* Header Info Gia Sư */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt={tutor.fullName}
              className="h-20 w-20 rounded-2xl border-2 border-indigo-100 bg-indigo-50 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900 dark:text-gray-100">
                  {tutor.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
                  <ShieldCheck className="h-3.5 w-3.5" /> Đã xác minh
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <GraduationCap className="h-4 w-4 text-indigo-500" />{' '}
                {tutor.qualification}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />{' '}
                  {tutor.averageRating?.toFixed(1) || '5.0'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {tutor.experienceYears} năm kinh nghiệm
                </span>
              </div>
            </div>
          </div>

          {/* Chọn Môn Học trên Header */}
          <div className="w-full border-t border-gray-100 pt-4 sm:w-64 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6 dark:border-gray-800">
            <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Môn muốn đăng ký học
            </label>
            <select
              value={selectedTutorSubjectId}
              onChange={(e) => setSelectedTutorSubjectId(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-indigo-600 focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-indigo-400"
            >
              {activeSubjects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.subject.name} ({item.feePerSessionCredits} Credits)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Giới thiệu bản thân */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100">
          <BookOpen className="h-4 w-4 text-indigo-600" />
          Giới thiệu bản thân
        </h2>
        <p className="mt-3 text-xs leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-300">
          {tutor.bio || 'Chưa có thông tin giới thiệu chi tiết.'}
        </p>
      </div>

      {/* Môn Học Đảm Nhận */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100">
          <GraduationCap className="h-4 w-4 text-indigo-600" />
          Môn học nhận dạy
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {activeSubjects.map((item: TutorSubject) => (
            <div
              key={item.id}
              onClick={() => setSelectedTutorSubjectId(item.id)}
              className={`flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition ${
                selectedTutorSubjectId === item.id
                  ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/20'
                  : 'border-gray-100 bg-gray-50/60 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-indigo-100 px-2.5 py-1 text-[10px] font-extrabold text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                    {item.subject.code}
                  </span>
                  <span className="rounded-lg bg-gray-200/70 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {item.teachingLevel}
                  </span>
                </div>

                <h3 className="mt-2 text-sm font-bold text-gray-900 dark:text-gray-100">
                  {item.subject.name}
                </h3>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-200/50 pt-2.5 dark:border-gray-800">
                <span className="text-[11px] text-gray-400">Học phí:</span>
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                  {item.feePerSessionCredits} Credits / buổi
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === BẢNG LỊCH RẢNH THEO TUẦN === */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <div>
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100">
              <CalendarIcon className="h-5 w-5 text-indigo-600" />
              Lịch rảnh của gia sư
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Chọn một khung giờ rảnh dưới đây để gửi yêu cầu đặt lịch hẹn.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
              disabled={currentWeekOffset <= 0}
              className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-bold dark:bg-gray-800 dark:text-gray-200">
              {currentWeekOffset === 0 ? 'Tuần này' : `Tuần +${currentWeekOffset}`}
            </span>
            <button
              onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
              className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Lưới 7 Ngày trong tuần */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          {weekDays.map((day) => {
            const slotsForDay = availabilities.filter(
              (a) =>
                a.dayOfWeek === day.backendDayOfWeek ||
                (a.dayOfWeek === 0 && day.backendDayOfWeek === 7),
            )

            return (
              <div
                key={day.dateStr}
                className={`flex min-h-[160px] flex-col rounded-2xl border p-3 ${
                  day.isPast
                    ? 'border-gray-100 bg-gray-50/50 opacity-60 dark:border-gray-800/40 dark:bg-gray-950/20'
                    : 'border-gray-200/80 bg-gray-50/30 dark:border-gray-800 dark:bg-gray-950/40'
                }`}
              >
                <div className="border-b border-gray-200/60 pb-2 text-center dark:border-gray-800">
                  <span className="block text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    {day.label}
                  </span>
                  <span className="block text-xs font-black text-gray-900 dark:text-gray-100">
                    {day.displayDate}
                  </span>
                </div>

                <div className="mt-3 flex-1 space-y-2">
                  {slotsForDay.length === 0 ? (
                    <div className="flex h-full items-center justify-center py-4 text-center">
                      <span className="text-[10px] text-gray-400 italic">Trống</span>
                    </div>
                  ) : (
                    slotsForDay.map((slot) => (
                      <button
                        key={slot.id}
                        disabled={day.isPast}
                        onClick={() =>
                          setSelectedBookingItem({
                            slot,
                            dateStr: day.dateStr,
                            displayDate: `${day.label}, ${day.displayDate}`,
                          })
                        }
                        className={`w-full rounded-xl border p-2 text-left transition-all ${
                          day.isPast
                            ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                            : 'border-indigo-200 bg-indigo-50/60 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:hover:bg-indigo-600'
                        }`}
                      >
                        <div className="flex items-center gap-1 text-[11px] font-black">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span>
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <span className="mt-1 block text-[9px] font-semibold opacity-80">
                          {day.isPast ? 'Đã qua' : 'Bấm để đặt'}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* === MODAL XÁC NHẬN ĐẶT LỊCH === */}
      {selectedBookingItem && (
        <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                Xác nhận lịch học
              </h3>
              <button
                onClick={() => setSelectedBookingItem(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chi tiết Lịch hẹn */}
            <div className="mt-4 space-y-4 text-xs">
              <div className="space-y-2 rounded-2xl bg-indigo-50/60 p-4 dark:bg-indigo-950/40">
                <p className="text-gray-500 dark:text-gray-400">
                  Gia sư:{' '}
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {tutor.fullName}
                  </span>
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Thời gian:{' '}
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {selectedBookingItem.displayDate} (
                    {selectedBookingItem.slot.startTime} -{' '}
                    {selectedBookingItem.slot.endTime})
                  </span>
                </p>
              </div>

              {/* Lựa chọn Môn học ngay trong Modal */}
              <div>
                <label className="mb-1 block font-semibold text-gray-700 dark:text-gray-300">
                  Chọn môn học đăng ký <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedTutorSubjectId}
                  onChange={(e) => setSelectedTutorSubjectId(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-bold text-indigo-600 focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-indigo-400"
                >
                  {activeSubjects.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.subject.name} - {item.teachingLevel} (
                      {item.feePerSessionCredits} Credits/buổi)
                    </option>
                  ))}
                </select>

                {/* Hiển thị chi tiết học phí của môn đã chọn */}
                {selectedSubjectObj && (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                    <span className="font-medium">Học phí thanh toán:</span>
                    <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                      {selectedSubjectObj.feePerSessionCredits} Credits
                    </span>
                  </div>
                )}
              </div>

              {/* Ghi chú */}
              <div>
                <label className="mb-1 block font-semibold text-gray-700 dark:text-gray-300">
                  Ghi chú cho gia sư (tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={studentNote}
                  onChange={(e) => setStudentNote(e.target.value)}
                  placeholder="VD: Em muốn tập trung ôn thi học kỳ..."
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Buttons Modal */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedBookingItem(null)}
                className="w-1/2 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-600 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={bookingMutation.isPending || !selectedTutorSubjectId}
                onClick={confirmBooking}
                className="flex w-1/2 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {bookingMutation.isPending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  'Đồng ý đặt lịch'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
