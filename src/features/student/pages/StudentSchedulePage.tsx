import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { studentApi } from '@/features/student/api/studentApi'
import { Calendar, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import type { Booking } from '../types/booking.types'
import { BookingStatus } from '@/constants/enums'
import { Toaster, toast } from 'react-hot-toast'

export default function StudentSchedulePage() {
  const navigate = useNavigate()

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => studentApi.getBookings(),
    select: (response: any) => {
      if (Array.isArray(response)) return response
      if (Array.isArray(response?.data)) return response.data
      if (Array.isArray(response?.data?.data)) return response.data.data
      return []
    },
  })

  // 🔔 Toast thông báo lỗi siêu đẹp
  useEffect(() => {
    if (isError && error) {
      const errResponse = (error as any)?.response?.data
      const errorMessage =
        errResponse?.message ||
        errResponse?.errorMessage ||
        errResponse?.title ||
        'Không thể lấy danh sách lịch học. Vui lòng thử lại!'

      toast.error(errorMessage)
    }
  }, [isError, error])

  const getStatusBadge = (status: BookingStatus | string | number) => {
    const s = status?.toString().toLowerCase()

    switch (s) {
      case String(BookingStatus.Confirmed):
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Đã xác nhận
          </span>
        )

      case String(BookingStatus.Pending):
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Chờ xử lý
          </span>
        )

      case String(BookingStatus.Completed):
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Hoàn thành
          </span>
        )

      case String(BookingStatus.Cancelled):
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-500/10 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
            Đã hủy
          </span>
        )

      case String(BookingStatus.Rejected):
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-3.5 w-3.5" /> Từ chối
          </span>
        )

      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
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
        <div className="flex h-40 items-center justify-center rounded-2xl border border-gray-100 bg-white/50 text-sm font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900/50">
          <RefreshCw className="mr-2 h-4 w-4 animate-spin text-indigo-500" />
          Đang tải danh sách lịch học...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400">
          Có lỗi xảy ra khi lấy danh sách lịch học. Vui lòng kiểm tra lại kết nối!
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          Bạn chưa có lịch học nào trong hệ thống.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-semibold tracking-wider text-gray-400 uppercase dark:border-gray-800 dark:bg-gray-950/50">
                  {/* <th className="p-4">Buổi học</th> */}
                  <th className="p-4">Thời gian học</th>
                  <th className="p-4">Học phí</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800">
                {bookings.map((item: Booking) => {
                  const start = new Date(item.startTimeUtc).getTime()
                  const end = new Date(item.endTimeUtc).getTime()
                  const durationMinutes = Math.round((end - start) / (1000 * 60))

                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-800/40"
                    >
                      {/* <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                            #{item.id}
                          </div>
                        </div>
                      </td> */}

                      <td className="p-4">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                            <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                            {formatDate(item.startTimeUtc)}
                          </div>
                          <div className="text-gray-400">
                            Thời lượng:{' '}
                            <strong className="text-gray-600 dark:text-gray-300">
                              {isNaN(durationMinutes) || durationMinutes <= 0
                                ? '--'
                                : `${durationMinutes} phút`}
                            </strong>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                          <span>⚡ {item.creditCost ?? 0}</span>
                          <span className="text-[10px] font-normal opacity-70">
                            credits
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        {getStatusBadge(item.status)}
                        {item.statusReason && (
                          <p className="mt-1.5 text-[11px] text-rose-500 italic">
                            Lý do: {item.statusReason}
                          </p>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/student/schedule/${item.id}`)}
                          className="rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          Chi tiết
                        </button>
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
