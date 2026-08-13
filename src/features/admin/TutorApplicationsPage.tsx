import { useEffect, useState } from 'react'
import { adminApi } from './admin.api'
import type { TutorApplication, TutorApplicationStatus } from './admin.types'
import { Table, type Column } from '@/components/ui/Table'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/ToastContext'

export function TutorApplicationsPage() {
  const toast = useToast()
  const [applications, setApplications] = useState<TutorApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<TutorApplicationStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal details & review state
  const [selectedApp, setSelectedApp] = useState<TutorApplication | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isActionLoading, setIsActionLoading] = useState(false)

  const loadApplications = async () => {
    setIsLoading(true)
    try {
      const data = await adminApi.getTutorApplications({
        status: statusFilter,
        query: searchQuery,
      })
      setApplications(data)
    } catch {
      toast.error('Không thể tải danh sách hồ sơ gia sư')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadApplications()
  }, [statusFilter, searchQuery])

  const handleApprove = async (app: TutorApplication) => {
    setIsActionLoading(true)
    try {
      await adminApi.reviewTutorApplication(app.id, 'approved')
      toast.success(`Đã duyệt thành công hồ sơ của gia sư ${app.fullName}`)
      setIsDetailModalOpen(false)
      setSelectedApp(null)
      void loadApplications()
    } catch {
      toast.error('Duyệt hồ sơ thất bại')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleRejectConfirm = async () => {
    if (!selectedApp) return
    if (!rejectionReason.trim()) {
      toast.warning('Vui lòng nhập lý do từ chối hồ sơ')
      return
    }
    setIsActionLoading(true)
    try {
      await adminApi.reviewTutorApplication(selectedApp.id, 'rejected', rejectionReason)
      toast.info(`Đã từ chối hồ sơ của gia sư ${selectedApp.fullName}`)
      setIsRejectModalOpen(false)
      setIsDetailModalOpen(false)
      setSelectedApp(null)
      setRejectionReason('')
      void loadApplications()
    } catch {
      toast.error('Xử lý thất bại')
    } finally {
      setIsActionLoading(false)
    }
  }

  const columns: Column<TutorApplication>[] = [
    {
      key: 'id',
      header: 'Mã hồ sơ',
      render: (row) => <span className="font-mono text-xs font-semibold text-gray-500">{row.id}</span>,
    },
    {
      key: 'fullName',
      header: 'Họ và tên gia sư',
      render: (row) => (
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100">{row.fullName}</p>
          <span className="text-xs text-gray-500">{row.email} • {row.phone}</span>
        </div>
      ),
    },
    {
      key: 'qualification',
      header: 'Trình độ & Bằng cấp',
      render: (row) => (
        <div>
          <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{row.qualification}</p>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            {row.experienceYears} năm kinh nghiệm
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row) => {
        const statusMap = {
          pending: { label: 'Chờ duyệt', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
          approved: { label: 'Đã duyệt', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
          rejected: { label: 'Từ chối', cls: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
        }
        const s = statusMap[row.status]
        return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.cls}`}>{s.label}</span>
      },
    },
    {
      key: 'createdAt',
      header: 'Ngày gửi',
      render: (row) => <span className="text-xs text-gray-500">{row.createdAt}</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedApp(row)
              setIsDetailModalOpen(true)
            }}
          >
            Chi tiết
          </Button>
          {row.status === 'pending' && (
            <Button
              size="sm"
              onClick={() => handleApprove(row)}
            >
              Duyệt
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Danh sách Hồ sơ Gia sư chờ duyệt
          </h2>
          <p className="text-xs text-gray-500">Xem thông tin cá nhân, bằng cấp và quyết định duyệt hồ sơ gia sư</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Tìm kiếm tên, email, trình độ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TutorApplicationStatus | 'all')}
            options={[
              { label: 'Tất cả trạng thái', value: 'all' },
              { label: 'Chờ duyệt', value: 'pending' },
              { label: 'Đã duyệt', value: 'approved' },
              { label: 'Từ chối', value: 'rejected' },
            ]}
            className="w-full sm:w-44"
          />
        </div>
      </div>

      {/* Applications Table */}
      <Table
        columns={columns}
        data={applications}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Không có hồ sơ gia sư nào phù hợp với bộ lọc"
      />

      {/* Detail Modal */}
      {selectedApp && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedApp(null)
          }}
          title={`Chi tiết Hồ sơ Gia sư — ${selectedApp.fullName}`}
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsDetailModalOpen(false)}>
                Đóng
              </Button>
              {selectedApp.status === 'pending' && (
                <>
                  <Button
                    variant="danger"
                    onClick={() => setIsRejectModalOpen(true)}
                  >
                    Từ chối hồ sơ
                  </Button>
                  <Button
                    loading={isActionLoading}
                    onClick={() => handleApprove(selectedApp)}
                  >
                    Duyệt hồ sơ ngay
                  </Button>
                </>
              )}
            </>
          }
        >
          <div className="space-y-6 text-sm text-gray-800 dark:text-gray-200">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-medium text-gray-500">Mã hồ sơ:</span>
                <p className="font-semibold">{selectedApp.id}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Họ và tên:</span>
                <p className="font-semibold">{selectedApp.fullName}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Email:</span>
                <p className="font-semibold">{selectedApp.email}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Số điện thoại:</span>
                <p className="font-semibold">{selectedApp.phone}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Trình độ đào tạo:</span>
                <p className="font-semibold">{selectedApp.qualification}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Kinh nghiệm:</span>
                <p className="font-semibold">{selectedApp.experienceYears} năm</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Môn học đăng ký giảng dạy
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedApp.subjects.map((sub) => (
                  <span
                    key={sub}
                    className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Giới thiệu & Phương pháp dạy
              </h4>
              <p className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl text-xs leading-relaxed">
                {selectedApp.bio}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Bằng cấp & Chứng chỉ đính kèm
              </h4>
              <div className="space-y-2">
                {selectedApp.degrees.map((deg, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span>📜</span>
                      <span className="font-medium">{deg.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                      Đã đối chiếu
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedApp.status === 'rejected' && selectedApp.rejectionReason && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">Lý do từ chối trước đó:</span>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{selectedApp.rejectionReason}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Reject Modal Form */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Nhập lý do Từ chối hồ sơ gia sư"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="danger"
              loading={isActionLoading}
              onClick={handleRejectConfirm}
            >
              Xác nhận Từ chối
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-gray-500">
            Vui lòng ghi rõ lý do từ chối để hệ thống tự động gửi thông báo phản hồi cho gia sư.
          </p>
          <textarea
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Ví dụ: Bằng cấp đính kèm mờ không rõ nét, vui lòng cập nhật lại..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      </Modal>
    </div>
  )
}
