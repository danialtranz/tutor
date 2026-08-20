import React from 'react'
import { Loader2, XCircle, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { BookingStatus } from '@/constants/enums'

interface CancelBookingTabProps {
  cancelReason: string
  setCancelReason: React.Dispatch<React.SetStateAction<string>>
  submittingSchedule: boolean
  onSubmit: (e: React.FormEvent) => void
  bookingStatus?: string | number
}

export default function CancelBookingTab({
  cancelReason,
  setCancelReason,
  submittingSchedule,
  onSubmit,
  bookingStatus,
}: CancelBookingTabProps) {
  console.log('status: ', bookingStatus)
  const isConfirmed = bookingStatus === BookingStatus.Confirmed
  const isPeding = bookingStatus === BookingStatus.Pending

  const isCancelled = bookingStatus === BookingStatus.Cancelled

  if (isCancelled) {
    return (
      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <CheckCircle2 className="h-6 w-6 text-gray-500" />
        </div>

        <h4 className="mt-3 text-sm font-bold text-gray-800 dark:text-gray-200">
          Buổi học đã được hủy
        </h4>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Lịch học này đã bị hủy và không thể thực hiện thao tác hủy thêm lần nữa.
        </p>
      </div>
    )
  }
  if (!isConfirmed && !isPeding) {
    return (
      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <AlertTriangle className="h-6 w-6 text-gray-500" />
        </div>

        <h4 className="mt-3 text-sm font-bold text-gray-800 dark:text-gray-200">
          Không thể hủy buổi học
        </h4>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Chỉ những buổi học đã được xác nhận hoặc đang xử lý mới có thể thực hiện hủy.
        </p>
      </div>
    )
  }
  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-4">
      <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/40 dark:bg-rose-950/20">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="h-4 w-4" />
          <h4 className="text-xs font-bold">Lưu ý khi hủy buổi học</h4>
        </div>

        <p className="mt-1 text-[11px] text-rose-500 dark:text-rose-400">
          Hủy buổi học trước thời hạn quy định sẽ được hoàn phí đầy đủ.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
          Lý do hủy buổi học
        </label>

        <textarea
          rows={3}
          placeholder="Mô tả lý do bạn muốn hủy..."
          className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-900 transition outline-none focus:border-rose-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={submittingSchedule}
        className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-rose-700 disabled:opacity-50"
      >
        {submittingSchedule ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="h-3.5 w-3.5" />
        )}
        Xác Nhận Hủy Buổi Học
      </button>
    </form>
  )
}
