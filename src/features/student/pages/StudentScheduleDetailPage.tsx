'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import { Calendar, Clock, Video, XCircle, RefreshCw } from 'lucide-react'
import { studentApi } from '../api/studentApi'
import type { Booking } from '../types/booking.types'

export default function StudentScheduleDetailPage() {
  const params = useParams()
  // Lưu ý: nếu route khai báo là /schedule/:id thì dùng params?.id, nếu khai báo :bookingId thì dùng params?.bookingId
  const bookingId = (params?.bookingId || params?.id) as string

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)

  // State quản lý form
  const [cancelReason, setCancelReason] = useState('')

  const [rescheduleData, setRescheduleData] = useState({
    proposedStartTimeUtc: '',
    proposedEndTimeUtc: '',
    reason: '',
  })

  // Gọi API lấy dữ liệu chi tiết
  const fetchDetail = useCallback(async () => {
    if (!bookingId) return
    try {
      setLoading(true)
      // Ép res thành any hoặc kiểu Response để truy cập .data
      const res = (await studentApi.getBookingDetail(bookingId)) as any

      // Lấy object data thực sự
      const bookingData: Booking = res?.data || res

      setBooking(bookingData)
    } catch (err) {
      console.error('Lỗi khi tải chi tiết lịch hẹn:', err)
    } finally {
      setLoading(false)
    }
  }, [bookingId])
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'N/A'
    const date = new Date(isoString)
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  // --- CÁC HÀM THAO TÁC API ---

  const handleCancel = async () => {
    if (!cancelReason) return alert('Vui lòng nhập lý do hủy')
    try {
      setSubmitting(true)
      await studentApi.cancelBooking(bookingId, { reason: cancelReason })
      alert('Đã hủy lịch hẹn')
      fetchDetail()
    } catch (err) {
      alert('Hủy thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReschedule = async () => {
    try {
      setSubmitting(true)
      await studentApi.requestReschedule(bookingId, rescheduleData)
      alert('Đã gửi yêu cầu dời lịch!')
      fetchDetail()
    } catch (err) {
      alert('Gửi yêu cầu dời lịch thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
        Đang tải thông tin lịch hẹn...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      {/* KHU VỰC THÔNG TIN CHUNG */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100">
              Chi tiết Lịch hẹn #{bookingId}
            </h1>
          </div>
          <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            Trạng thái: {booking?.status ?? 'N/A'}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 md:grid-cols-3 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800">
              <Calendar className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Bắt đầu</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {formatDateTime(booking?.startTimeUtc) || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800">
              <Clock className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Kết thúc</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {formatDateTime(booking?.endTimeUtc) || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800">
              <Video className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Lớp học</p>
              {booking?.meetingUrl ? (
                <a
                  href={booking.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Vào lớp ngay 🔗
                </a>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">Chưa có link</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CÁC THAO TÁC XỬ LÝ */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* HỦY LỊCH HẸN (CẢ HỌC SINH VÀ GIA SƯ) */}
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100">
            <XCircle className="h-5 w-5 text-rose-500" /> Hủy lịch hẹn
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Lý do hủy:
              </label>
              <textarea
                rows={3}
                placeholder="Nhập chi tiết lý do muốn hủy..."
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm text-gray-900 transition focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <button
              disabled={submitting}
              onClick={handleCancel}
              className="w-full rounded-xl bg-gray-900 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-black disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              Hủy lịch hẹn
            </button>
          </div>
        </div>

        {/* YÊU CẦU DỜI LỊCH */}
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100">
            <RefreshCw className="h-5 w-5 text-amber-500" /> Đề xuất dời lịch
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Bắt đầu mới:
                </label>
                <input
                  type="datetime-local"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white p-2 text-xs text-gray-900 transition focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                  value={rescheduleData.proposedStartTimeUtc}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      proposedStartTimeUtc: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Kết thúc mới:
                </label>
                <input
                  type="datetime-local"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white p-2 text-xs text-gray-900 transition focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                  value={rescheduleData.proposedEndTimeUtc}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      proposedEndTimeUtc: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Lý do dời lịch:
              </label>
              <input
                type="text"
                placeholder="Nhập lý do..."
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm text-gray-900 transition focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                value={rescheduleData.reason}
                onChange={(e) =>
                  setRescheduleData({ ...rescheduleData, reason: e.target.value })
                }
              />
            </div>
            <button
              disabled={submitting}
              onClick={handleReschedule}
              className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-600 disabled:opacity-50"
            >
              Gửi Đề Xuất Dời Lịch
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
