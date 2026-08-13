import { useEffect, useState } from 'react'
import { adminApi } from './admin.api'
import type { Complaint, ComplaintStatus } from './admin.types'
import { Table, type Column } from '@/components/ui/Table'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/ToastContext'

export function ComplaintsPage() {
  const toast = useToast()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all')

  // Resolve Modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [decision, setDecision] = useState<'resolved' | 'rejected'>('resolved')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadComplaints = async () => {
    setIsLoading(true)
    try {
      const data = await adminApi.getComplaints(statusFilter)
      setComplaints(data)
    } catch {
      toast.error('Không thể tải danh sách khiếu nại')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadComplaints()
  }, [statusFilter])

  const handleOpenDetail = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setResolutionNotes(complaint.resolutionNotes || '')
    setDecision('resolved')
  }

  const handleResolveSubmit = async () => {
    if (!selectedComplaint) return
    if (!resolutionNotes.trim()) {
      toast.warning('Vui lòng nhập nội dung xử lý/quyết định khiếu nại')
      return
    }

    setIsSubmitting(true)
    try {
      await adminApi.resolveComplaint(selectedComplaint.id, decision, resolutionNotes)
      toast.success(`Đã cập nhật kết quả xử lý khiếu nại ${selectedComplaint.id}`)
      setSelectedComplaint(null)
      void loadComplaints()
    } catch {
      toast.error('Xử lý khiếu nại thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns: Column<Complaint>[] = [
    {
      key: 'id',
      header: 'Mã khiếu nại',
      render: (row) => <span className="font-mono text-xs font-bold text-gray-500">{row.id}</span>,
    },
    {
      key: 'complainantName',
      header: 'Người khiếu nại & Đối tượng',
      render: (row) => (
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100">{row.complainantName}</p>
          <span className="text-xs text-rose-600 dark:text-rose-400">Khiếu nại: <strong>{row.targetName}</strong></span>
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Tiêu đề khiếu nại',
      render: (row) => (
        <div>
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{row.title}</p>
          <p className="text-xs text-gray-500 truncate max-w-xs">{row.content}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row) => {
        const map = {
          pending: { label: 'Mới gửi', cls: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
          in_progress: { label: 'Đang xử lý', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
          resolved: { label: 'Đã giải quyết', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
          rejected: { label: 'Từ chối giải quyết', cls: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
        }
        const s = map[row.status]
        return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.cls}`}>{s.label}</span>
      },
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      render: (row) => <span className="text-xs text-gray-500">{row.createdAt}</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (row) => (
        <Button size="sm" onClick={() => handleOpenDetail(row)}>
          {row.status === 'resolved' || row.status === 'rejected' ? 'Xem kết quả' : 'Xử lý khiếu nại'}
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Danh sách & Tiếp nhận Xử lý Khiếu Nại
          </h2>
          <p className="text-xs text-gray-500">Tiếp nhận phản hồi giữa Học viên và Gia sư, đưa ra quyết định xử lý hòa giải</p>
        </div>

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | 'all')}
          options={[
            { label: 'Tất cả trạng thái', value: 'all' },
            { label: 'Mới gửi', value: 'pending' },
            { label: 'Đang xử lý', value: 'in_progress' },
            { label: 'Đã giải quyết', value: 'resolved' },
            { label: 'Từ chối', value: 'rejected' },
          ]}
          className="w-full sm:w-56"
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={complaints}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Không có khiếu nại nào"
      />

      {/* Detail & Resolve Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title={`Chi tiết Khiếu Nại — ${selectedComplaint.id}`}
          size="lg"
          footer={
            selectedComplaint.status !== 'resolved' && selectedComplaint.status !== 'rejected' ? (
              <>
                <Button variant="ghost" onClick={() => setSelectedComplaint(null)}>
                  Đóng
                </Button>
                <Button loading={isSubmitting} onClick={handleResolveSubmit}>
                  Gửi quyết định xử lý
                </Button>
              </>
            ) : (
              <Button variant="ghost" onClick={() => setSelectedComplaint(null)}>
                Đóng
              </Button>
            )
          }
        >
          <div className="space-y-5 text-sm">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-500">Mã khiếu nại: {selectedComplaint.id}</span>
                <span className="text-gray-400">Ngày tạo: {selectedComplaint.createdAt}</span>
              </div>
              <p className="font-bold text-base text-gray-900 dark:text-gray-100">{selectedComplaint.title}</p>
              <div className="flex items-center gap-4 text-xs">
                <span>Bên khiếu nại: <strong className="text-indigo-600">{selectedComplaint.complainantName}</strong></span>
                <span>Bị khiếu nại: <strong className="text-rose-600">{selectedComplaint.targetName}</strong></span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Nội dung chi tiết phản ánh
              </h4>
              <p className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl text-xs leading-relaxed text-gray-800 dark:text-gray-200">
                {selectedComplaint.content}
              </p>
            </div>

            {/* Resolution Form or Result view */}
            {selectedComplaint.status === 'resolved' || selectedComplaint.status === 'rejected' ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-1">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Kết quả xử lý từ Ban Quản Trị ({selectedComplaint.resolvedAt}):
                </span>
                <p className="text-xs text-emerald-700 dark:text-emerald-200 leading-relaxed">
                  {selectedComplaint.resolutionNotes}
                </p>
              </div>
            ) : (
              <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                  Nhập Quyết định & Nội dung xử lý từ Admin
                </h4>

                <Select
                  label="Quyết định xử lý"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as 'resolved' | 'rejected')}
                  options={[
                    { label: 'Chấp nhận khiếu nại & Đã giải quyết hòa giải', value: 'resolved' },
                    { label: 'Từ chối khiếu nại (Không đủ bằng chứng / Bác bỏ)', value: 'rejected' },
                  ]}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    Nội dung kết luận xử lý gửi tới 2 bên
                  </label>
                  <textarea
                    rows={4}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Ví dụ: Đã liên hệ 2 bên hòa giải, gia sư đồng ý bù 2 buổi dạy vào tuần kế tiếp..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-xs outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
