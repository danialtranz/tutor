import { useEffect, useState, type FormEvent } from 'react'
import { adminApi } from './admin.api'
import type { Subject } from './admin.types'
import { Table, type Column } from '@/components/ui/Table'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/ToastContext'

export function SubjectsPage() {
  const toast = useToast()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Create & Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete Confirm Dialog
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadSubjects = async () => {
    setIsLoading(true)
    try {
      const data = await adminApi.getSubjects(searchQuery)
      setSubjects(data)
    } catch {
      toast.error('Không thể tải danh sách môn học')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadSubjects()
  }, [searchQuery])

  const handleOpenCreate = () => {
    setEditingSubject(null)
    setCode(`SUB-${Math.floor(Math.random() * 90 + 10)}`)
    setName('')
    setDescription('')
    setStatus('active')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setCode(subject.code)
    setName(subject.name)
    setDescription(subject.description)
    setStatus(subject.status)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !code.trim()) {
      toast.warning('Vui lòng nhập tên môn học và mã môn học')
      return
    }

    setIsSubmitting(true)
    try {
      if (editingSubject) {
        await adminApi.updateSubject(editingSubject.id, {
          code,
          name,
          description,
        })
        if ((editingSubject.status === 'active') !== (status === 'active')) {
          await adminApi.setSubjectStatus(editingSubject.id, status === 'active')
        }
        toast.success(`Đã cập nhật môn học "${name}"`)
      } else {
        const created = await adminApi.createSubject({
          code,
          name,
          description,
        })
        if (status === 'inactive') {
          await adminApi.setSubjectStatus(created.id, false)
        }
        toast.success(`Đã thêm môn học mới "${name}"`)
      }
      setIsModalOpen(false)
      void loadSubjects()
    } catch {
      toast.error('Lưu môn học thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingSubject) return
    setIsDeleting(true)
    try {
      await adminApi.deleteSubject(deletingSubject.id)
      toast.info(`Đã xóa/ẩn môn học "${deletingSubject.name}"`)
      setDeletingSubject(null)
      void loadSubjects()
    } catch {
      toast.error('Xóa môn học thất bại')
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: Column<Subject>[] = [
    {
      key: 'code',
      header: 'Mã Môn',
      render: (row) => <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{row.code}</span>,
    },
    {
      key: 'name',
      header: 'Tên Môn Học',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{row.name}</p>
          <span className="text-xs text-slate-500">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng Thái',
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            row.status === 'active'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60'
              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-300/60'
          }`}
        >
          {row.status === 'active' ? '● Đang mở' : '○ Đã khóa'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => handleOpenEdit(row)}>
            ✏️ Sửa
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeletingSubject(row)}>
            🗑️ Xóa
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Quản lý Môn học
          </h2>
          <p className="text-xs text-slate-500 mt-1">Cấu hình danh mục môn học, học phí tham chiếu và trạng thái hiển thị trên hệ thống</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="🔍 Tìm môn học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button variant="gradient" onClick={handleOpenCreate} className="shrink-0">
            + Thêm Môn Học
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={subjects}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Không tìm thấy môn học nào"
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? `Chỉnh sửa môn học — ${editingSubject.name}` : 'Thêm mới Môn học'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Mã môn học"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <Input
            label="Tên môn học"
            placeholder="Ví dụ: Luyện thi IELTS, Toán Phổ thông..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Mô tả chi tiết môn học
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập tóm tắt nội dung môn học..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <Select
            label="Trạng thái môn học"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
            options={[
              { label: 'Đang mở (Hiển thị cho học viên & gia sư)', value: 'active' },
              { label: 'Ẩn / Tạm đóng môn học', value: 'inactive' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="gradient" loading={isSubmitting}>
              {editingSubject ? 'Lưu cập nhật' : 'Tạo môn học mới'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      {deletingSubject && (
        <ConfirmDialog
          isOpen={!!deletingSubject}
          onClose={() => setDeletingSubject(null)}
          onConfirm={handleDeleteConfirm}
          title="Xác nhận xóa môn học"
          message={`Bạn có chắc chắn muốn xóa môn học "${deletingSubject.name}" (${deletingSubject.code})? Hành động này sẽ chuyển trạng thái môn học sang Đã ẩn.`}
          confirmText="Xóa Môn Học"
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}
