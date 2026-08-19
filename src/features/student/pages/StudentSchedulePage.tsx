import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { studentApi } from '@/features/student/api/studentApi'
import { Calendar, Star, X, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import type { Booking, BookingStatus } from '../types/booking.types'

export default function StudentSchedulePage() {
  const navigate = useNavigate()
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<number | null>(
    null,
  )

  // 💡 Lấy danh sách booking và unwrap đúng mảng data
  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => studentApi.getBookings(),
    select: (response: any) => {
      // Xử lý linh hoạt mọi kiểu trả về từ Backend
      if (Array.isArray(response)) return response
      if (Array.isArray(response?.data)) return response.data
      if (Array.isArray(response?.data?.data)) return response.data.data
      return []
    },
  })

  const getStatusBadge = (status: BookingStatus | string | number) => {
    const s = status?.toString().toLowerCase()

    switch (s) {
      case 'confirmed':
      case '2':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Đã xác nhận
          </span>
        )

      case 'pending':
      case '0':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <RefreshCw className="h-3 w-3 animate-spin" /> Chờ xử lý
          </span>
        )

      case 'completed':
      case '5':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <CheckCircle2 className="h-3 w-3" /> Hoàn thành
          </span>
        )

      case 'cancelled':
      case '4':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            Đã hủy
          </span>
        )

      case 'rejected':
      case '2':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <AlertCircle className="h-3 w-3" /> Từ chối
          </span>
        )

      default:
        return (
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {status ?? 'N/A'}
          </span>
        )
    }
  }

  const formatDate = (utcString: string) => {
    if (!utcString) return 'N/A'
    try {
      return new Date(utcString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return utcString
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
          Quản lý Lịch học
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Theo dõi các buổi học sắp tới, lịch sử đăng ký và đánh giá chất lượng gia sư.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
          Đang tải lịch học...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400">
          Có lỗi xảy ra khi lấy danh sách lịch học. Vui lòng thử lại sau!
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          Bạn chưa có lịch học nào trong hệ thống.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-semibold tracking-wider text-gray-400 uppercase dark:border-gray-800 dark:bg-gray-950/50">
                  <th className="p-4">Buổi học</th>
                  <th className="p-4">Thời gian học</th>
                  <th className="p-4">Học phí (Credit)</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800">
                {bookings.map((item: Booking) => {
                  const start = new Date(item.startTimeUtc).getTime()
                  const end = new Date(item.endTimeUtc).getTime()
                  const durationMinutes = Math.round((end - start) / (1000 * 60))
                  const statusNormalized = item.status?.toString().toLowerCase()

                  return (
                    <tr
                      key={item.id}
                      className="transition hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                    >
                      {/* CỘT 1: Thông tin môn học & Ghi chú */}
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                            #{item.tutorSubjectId ?? item.id}
                          </div>

                          {/* <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 dark:text-gray-100">
                                Lớp học #{item.id}
                              </span>
                              <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                Môn #{item.tutorSubjectId}
                              </span>
                            </div>

                            {item.studentNote ? (
                              <p className="line-clamp-1 text-xs text-gray-500 italic dark:text-gray-400">
                                "{item.studentNote}"
                              </p>
                            ) : (
                              <p className="text-xs text-gray-400">Không có ghi chú</p>
                            )}

                            {item.meetingUrl &&
                              (statusNormalized === 'confirmed' ||
                                statusNormalized === '1') && (
                                <a
                                  href={item.meetingUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                                >
                                  🔗 Vào phòng học online
                                </a>
                              )}
                          </div> */}
                        </div>
                      </td>

                      {/* CỘT 2: Thời gian học & Thời lượng */}
                      <td className="p-4">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                            <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                            {formatDate(item.startTimeUtc)}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <span>
                              Thời lượng:{' '}
                              <strong className="text-gray-600 dark:text-gray-300">
                                {isNaN(durationMinutes) || durationMinutes <= 0
                                  ? '--'
                                  : `${durationMinutes} phút`}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CỘT 3: Credit */}
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                          <span>⚡ {item.creditCost ?? 0}</span>
                          <span className="text-[10px] font-normal opacity-80">
                            credits
                          </span>
                        </div>
                      </td>

                      {/* CỘT 4: Trạng thái */}
                      <td className="p-4">
                        {getStatusBadge(item.status)}

                        {item.statusReason && (
                          <p className="mt-1 line-clamp-1 text-[11px] text-rose-500 italic">
                            Lý do: {item.statusReason}
                          </p>
                        )}
                      </td>

                      {/* CỘT 5: Thao tác & Chuyển hướng Chi tiết */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Nút Xem chi tiết chuyển sang route trang chi tiết */}
                          <button
                            type="button"
                            onClick={() => navigate(`/student/schedule/${item.id}`)}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                          >
                            Chi tiết
                          </button>

                          {/* Các thao tác theo trạng thái */}
                          {/* {(() => {
                            if (
                              statusNormalized === 'completed' ||
                              statusNormalized === '4'
                            ) {
                              return (
                                <button
                                  type="button"
                                  onClick={() => setSelectedBookingForReview(item.id)}
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700"
                                >
                                  <Star className="h-3.5 w-3.5" />
                                  Đánh giá
                                </button>
                              )
                            }

                            if (
                              statusNormalized === 'pending' ||
                              statusNormalized === 'confirmed' ||
                              statusNormalized === '0' ||
                              statusNormalized === '1'
                            ) {
                              return (
                                <button
                                  type="button"
                                  onClick={() => navigate(`/student/schedule/${item.id}`)}
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 dark:hover:bg-rose-900/60"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  Hủy / Dời lịch
                                </button>
                              )
                            }

                            return null
                          })()} */}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
