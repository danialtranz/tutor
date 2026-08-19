import React, { useState } from 'react'
import { Loader2, Send, CalendarCheck, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { RescheduleRequestStatus } from '@/constants/enums'

// Interface cho một Proposal dời lịch từ API
export interface RescheduleProposal {
  id: number | string
  proposedStartTimeUtc: string
  proposedEndTimeUtc: string
  reason: string
  status: 'Pending' | 'Approved' | 'Rejected' | number
  createdAt?: string
}

interface RescheduleData {
  proposedStartTimeUtc: string
  proposedEndTimeUtc: string
  reason: string
}

interface RescheduleTabProps {
  bookingId: number | string
  // Yêu cầu đổi lịch hiện có (nếu có)
  pendingProposal?: RescheduleProposal | null
  rescheduleData: RescheduleData
  setRescheduleData: React.Dispatch<React.SetStateAction<RescheduleData>>
  submittingSchedule: boolean
  onSubmitCreateProposal: (e: React.FormEvent) => void
  // Handler xử lý Đồng ý / Từ chối yêu cầu
  onUpdateProposalStatus?: (
    proposalId: number | string,
    status: number,
    responseNote: string,
  ) => Promise<void>
}

export default function RescheduleTab({
  pendingProposal,
  rescheduleData,
  setRescheduleData,
  submittingSchedule,
  onSubmitCreateProposal,
  onUpdateProposalStatus,
}: RescheduleTabProps) {
  const [responseNote, setResponseNote] = useState('')
  const [processingStatus, setProcessingStatus] = useState<number | null>(null) // 1: Approve, 2: Reject

  // Helper format hiển thị ngày giờ thân thiện
  const formatDateTime = (isoString: string) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    return isNaN(date.getTime())
      ? isoString
      : date.toLocaleString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
  }

  // Xử lý Phản hồi Yêu cầu (Đồng ý / Từ chối)
  const handleAction = async (status: number) => {
    if (!pendingProposal || !onUpdateProposalStatus) return
    setProcessingStatus(status)
    try {
      await onUpdateProposalStatus(pendingProposal.id, status, responseNote)
      setResponseNote('')
    } finally {
      setProcessingStatus(null)
    }
  }

  // 💡 TRƯỜNG HỢP 1: CÓ YÊU CẦU ĐỔI LỊCH ĐANG CHỜ XỬ LÝ (PENDING)
  if (
    pendingProposal &&
    (pendingProposal.status === 'Pending' ||
      pendingProposal.status === RescheduleRequestStatus.Pending)
  ) {
    return (
      <div className="mt-5 space-y-4 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
        {/* Header Thông báo */}
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
          <Clock className="h-5 w-5 shrink-0" />
          <h4 className="text-sm font-bold">Đang có yêu cầu dời lịch học mới</h4>
        </div>

        {/* Thông tin thời gian đề xuất */}
        <div className="rounded-xl border border-amber-200 bg-white p-3.5 text-xs shadow-sm dark:border-amber-900/80 dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Bắt đầu mới đề xuất:
              </span>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {formatDateTime(pendingProposal.proposedStartTimeUtc)}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Kết thúc mới đề xuất:
              </span>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {formatDateTime(pendingProposal.proposedEndTimeUtc)}
              </p>
            </div>
          </div>

          {pendingProposal.reason && (
            <div className="mt-2.5 border-t border-gray-100 pt-2 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">Lý do dời lịch:</span>
              <p className="mt-0.5 text-gray-700 italic dark:text-gray-300">
                "{pendingProposal.reason}"
              </p>
            </div>
          )}
        </div>

        {/* Ghi chú phản hồi */}
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300">
            Ghi chú phản hồi (Không bắt buộc)
          </label>
          <input
            type="text"
            placeholder="Nhập ghi chú phản hồi..."
            value={responseNote}
            onChange={(e) => setResponseNote(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
          />
        </div>

        {/* Action Buttons: Đồng ý / Từ chối */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            disabled={processingStatus !== null}
            onClick={() => handleAction(1)} // 1: Approve
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {processingStatus === RescheduleRequestStatus.Accepted ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            Chấp nhận dời lịch
          </button>

          <button
            type="button"
            disabled={processingStatus !== null}
            onClick={() => handleAction(RescheduleRequestStatus.Rejected)} // 2: Reject
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {processingStatus === RescheduleRequestStatus.Rejected ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            Từ chối
          </button>
        </div>
      </div>
    )
  }

  // 💡 TRƯỜNG HỢP 2: KHÔNG CÓ YÊU CẦU ĐANG CHỜ -> HIỂN THỊ FORM ĐỀ XUẤT DỜI LỊCH MỚI
  return (
    <form onSubmit={onSubmitCreateProposal} className="mt-5 space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
        <CalendarCheck className="h-4 w-4 text-indigo-600" />
        <span>Đề xuất khung thời gian dời lịch mới</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
            Thời gian bắt đầu mới
          </label>
          <input
            type="datetime-local"
            className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-900 transition outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            value={rescheduleData.proposedStartTimeUtc}
            onChange={(e) =>
              setRescheduleData({
                ...rescheduleData,
                proposedStartTimeUtc: e.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
            Thời gian kết thúc mới
          </label>
          <input
            type="datetime-local"
            className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-900 transition outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            value={rescheduleData.proposedEndTimeUtc}
            onChange={(e) =>
              setRescheduleData({
                ...rescheduleData,
                proposedEndTimeUtc: e.target.value,
              })
            }
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
          Lý do dời lịch
        </label>
        <textarea
          rows={3}
          placeholder="Nhập lý do dời lịch gửi đến đối phương..."
          className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-900 transition outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
          value={rescheduleData.reason}
          onChange={(e) =>
            setRescheduleData({
              ...rescheduleData,
              reason: e.target.value,
            })
          }
          required
        />
      </div>

      <button
        type="submit"
        disabled={submittingSchedule}
        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {submittingSchedule ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-3.5 w-3.5" />
        )}
        Gửi Yêu Cầu Dời Lịch
      </button>
    </form>
  )
}
