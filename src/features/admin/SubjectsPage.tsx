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
  const [category, setCategory] = useState('Khoa học Tự nhiên')
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
    setCategory('Khoa học Tự nhiên')
    setDescription('')
    setStatus('active')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setCode(subject.code)
    setName(subject.name)
    setCategory(subject.category)
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
          category,
          description,
          status,
        })
        toast.success(`Đã cập nhật môn học "${name}"`)
      } else {
        await adminApi.createSubject({
          code,
          name,
          category,
          description,
          status,
        })
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
      render: (row) => <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{row.code}</span>,
    },
    {
      key: 'name',
      header: 'Tên Môn Học',
      render: (row) => (
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100">{row.name}</p>
          <span className="text-xs text-gray-500">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Danh Mục',
      render: (row) => (
        <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium">
          {row.category}
        </span>
      ),
    },
    {
      key: 'tutorCount',
      header: 'Số Gia Sư',
      render: (row) => <span className="text-xs font-semibold">{row.tutorCount} gia sư</span>,
    },
    {
      key: 'status',
      header: 'Trạng Thái',
      render: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            row.status === 'active'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          {row.status === 'active' ? 'Đang mở' : 'Đã ẩn / Đóng'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => handleOpenEdit(row)}>
            Sửa
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeletingSubject(row)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Quản lý Danh mục Môn Học
          </h2>
          <p className="text-xs text-gray-500">Thêm mới, chỉnh sửa thông tin và bật/tắt môn học trong hệ thống</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Tìm môn học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button onClick={handleOpenCreate} className="shrink-0">
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
            <Select
              label="Danh mục"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { label: 'Khoa học Tự nhiên', value: 'Khoa học Tự nhiên' },
                { label: 'Khoa học Xã hội', value: 'Khoa học Xã hội' },
                { label: 'Ngoại ngữ', value: 'Ngoại ngữ' },
                { label: 'Công nghệ Thông tin', value: 'Công nghệ Thông tin' },
                { label: 'Nghệ thuật / Kỹ năng', value: 'Nghệ thuật / Kỹ năng' },
              ]}
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
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Mô tả chi tiết môn học
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập tóm tắt nội dung môn học..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
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

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" loading={isSubmitting}>
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
          message={`Bạn có chắc chắn muốn xóa môn học "${deletingSubject.name}" (${deletingSubject.code})? Hành động này sẽ ẩn môn học khỏi hệ thống.`}
          confirmText="Xóa Môn Học"
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}
