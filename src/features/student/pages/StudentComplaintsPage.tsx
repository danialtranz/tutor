import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentApi } from '@/features/student/api/studentApi'
import { AlertTriangle, Plus, X } from 'lucide-react'
import type { Complaint, ComplaintCreateRequest } from '../types/complaint.type'

// Map enum status từ backend (number)
export const ComplaintStatus = {
  Open: 1,
  InReview: 2,
  Resolved: 3,
  Rejected: 4,
} as const

export default function StudentComplaintsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form states
  const [bookingId, setBookingId] = useState<number | ''>('')
  const [againstUserId, setAgainstUserId] = useState<number | ''>('')
  const [type, setType] = useState<string>('NoShow')
  const [description, setDescription] = useState('')
  const [evidenceUrl, setEvidenceUrl] = useState('')

  // 1. Fetch danh sách khiếu nại (đổi tên hàm theo api trong file studentApi: getComplaints)
  const { data: complaintsData, isLoading } = useQuery({
    queryKey: ['my-complaints'],
    queryFn: () => studentApi.getComplaints(),
  })

  const complaints = complaintsData?.items || []

  // 2. Mutation tạo khiếu nại
  const createComplaintMutation = useMutation({
    mutationFn: studentApi.createComplaint,
    onSuccess: () => {
      alert('Gửi khiếu nại thành công! Admin sẽ tiến hành kiểm tra.')
      setIsModalOpen(false)
      resetForm()
      queryClient.invalidateQueries({ queryKey: ['my-complaints'] })
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo khiếu nại.')
    },
  })

  const resetForm = () => {
    setBookingId('')
    setAgainstUserId('')
    setType('NoShow')
    setDescription('')
    setEvidenceUrl('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!bookingId || !againstUserId) {
      alert('Vui lòng nhập đầy đủ Booking ID và ID người bị khiếu nại!')
      return
    }

    const payload: ComplaintCreateRequest = {
      againstUserId: Number(againstUserId),
      bookingId: Number(bookingId),
      type,
      description,
      evidenceUrl: evidenceUrl.trim() || undefined,
    }

    createComplaintMutation.mutate(payload)
  }

  // Render Badge theo status (number)
  const getStatusBadge = (status: number) => {
    switch (status) {
      case ComplaintStatus.Open:
        return (
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            Chờ xử lý
          </span>
        )
      case ComplaintStatus.InReview:
        return (
          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            Đang xem xét
          </span>
        )
      case ComplaintStatus.Resolved:
        return (
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            Đã giải quyết
          </span>
        )
      case ComplaintStatus.Rejected:
        return (
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            Từ chối
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
            Khác
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
            Khiếu nại & Báo cáo
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Gửi phản hồi khi xảy ra sự cố trong quá trình học tập.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
        >
          <Plus className="h-4 w-4" /> Tạo khiếu nại mới
        </button>
      </div>

      {/* Danh sách khiếu nại */}
      {isLoading ? (
        <div className="p-12 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
          Đang tải danh sách khiếu nại...
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-semibold tracking-wider text-gray-400 uppercase dark:border-gray-800 dark:bg-gray-950/50">
                <th className="p-4">Mã Booking</th>
                <th className="p-4">Người bị khiếu nại</th>
                <th className="p-4">Loại sự cố</th>
                <th className="p-4">Mô tả</th>
                <th className="p-4">Ngày tạo</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Phản hồi từ Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800">
              {complaints.map((item: Complaint) => (
                <tr
                  key={item.id}
                  className="transition hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                >
                  <td className="p-4 text-xs font-bold text-gray-700 dark:text-gray-300">
                    #{item.bookingId}
                  </td>
                  <td className="p-4 text-xs text-gray-900 dark:text-gray-100">
                    {item.againstUser?.fullName || `ID: ${item.againstUser?.id}`}
                  </td>
                  <td className="p-4 font-bold text-gray-900 dark:text-gray-100">
                    {item.type}
                  </td>
                  <td className="max-w-xs truncate p-4 text-xs text-gray-600 dark:text-gray-400">
                    {item.description}
                  </td>
                  <td className="p-4 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.submittedAtUtc).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-4">{getStatusBadge(item.status)}</td>
                  <td className="p-4 text-xs text-gray-600 italic dark:text-gray-400">
                    {item.adminResponse || 'Chưa có phản hồi'}
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-xs text-gray-500 dark:text-gray-400"
                  >
                    Bạn chưa có khiếu nại nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Tạo Khiếu Nại */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <div className="flex items-center gap-2 text-base font-bold text-rose-600 dark:text-rose-500">
                <AlertTriangle className="h-5 w-5" /> Tạo khiếu nại sự cố
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Field: Booking ID & Against User ID */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Mã Booking <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={bookingId}
                  onChange={(e) =>
                    setBookingId(e.target.value ? Number(e.target.value) : '')
                  }
                  required
                  placeholder="Ví dụ: 102"
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm text-gray-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  ID Người Bị Báo Cáo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={againstUserId}
                  onChange={(e) =>
                    setAgainstUserId(e.target.value ? Number(e.target.value) : '')
                  }
                  required
                  placeholder="Ví dụ: 15"
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm text-gray-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Field: Loại khiếu nại */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Loại khiếu nại
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm text-gray-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
              >
                <option value="NoShow">Gia sư không vào lớp (NoShow)</option>
                <option value="PoorQuality">
                  Chất lượng dạy không đạt (PoorQuality)
                </option>
                <option value="Other">Lý do khác (Other)</option>
              </select>
            </div>

            {/* Field: Link bằng chứng */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Link bằng chứng (hình ảnh/video - Không bắt buộc)
              </label>
              <input
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://example.com/evidence.jpg"
                className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm text-gray-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
              />
            </div>

            {/* Field: Mô tả */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Mô tả sự cố <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={createComplaintMutation.isPending}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
              >
                {createComplaintMutation.isPending ? 'Đang gửi...' : 'Gửi khiếu nại'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
