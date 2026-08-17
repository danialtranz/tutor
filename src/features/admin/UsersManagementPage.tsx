import { useEffect, useState } from 'react'
import { adminApi } from './admin.api'
import type { AdminUser } from './admin.types'
import { Table, type Column } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/ToastContext'

export function UsersManagementPage() {
  const toast = useToast()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [selectedAction, setSelectedAction] = useState<'lock' | 'unlock' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await adminApi.getUsers(search)
      setUsers(data)
    } catch {
      toast.error('Không thể tải danh sách người dùng')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [search])

  const handleAction = async (user: AdminUser, action: 'lock' | 'unlock') => {
    setSelectedUser(user)
    setSelectedAction(action)
  }

  const confirmAction = async () => {
    if (!selectedUser || !selectedAction) return
    setIsSubmitting(true)
    try {
      if (selectedAction === 'lock') {
        await adminApi.lockUser(selectedUser.id, 'Khóa bởi admin')
        toast.info(`Đã khóa tài khoản ${selectedUser.name}`)
      } else {
        await adminApi.unlockUser(selectedUser.id)
        toast.success(`Đã mở khóa tài khoản ${selectedUser.name}`)
      }
      setSelectedAction(null)
      setSelectedUser(null)
      void loadUsers()
    } catch {
      toast.error('Thao tác không thành công')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns: Column<AdminUser>[] = [
    { key: 'id', header: 'Mã người dùng', render: (row) => <span className="font-mono text-xs">{row.id}</span> },
    { key: 'name', header: 'Tên', render: (row) => row.name },
    { key: 'email', header: 'Email', render: (row) => row.email },
    { key: 'role', header: 'Vai trò', render: (row) => row.role },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row) => (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
          row.status === 'active'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
        }`}>
          {row.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={row.status === 'active' ? 'danger' : 'secondary'}
            onClick={() => handleAction(row, row.status === 'active' ? 'lock' : 'unlock')}
          >
            {row.status === 'active' ? 'Khóa' : 'Mở khóa'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Quản lý Người dùng</h2>
          <p className="text-xs text-gray-500">Lọc, xem và khóa/mở khóa tài khoản người dùng hệ thống.</p>
        </div>
        <Input
          placeholder="Tìm kiếm email hoặc tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>

      <Table columns={columns} data={users} keyExtractor={(row) => row.id} isLoading={isLoading} emptyMessage="Không có người dùng" />

      <ConfirmDialog
        isOpen={!!selectedUser && !!selectedAction}
        title={selectedAction === 'lock' ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản'}
        message={`Bạn có chắc muốn ${selectedAction === 'lock' ? 'khóa' : 'mở khóa'} tài khoản ${selectedUser?.name}?`}
        confirmText={selectedAction === 'lock' ? 'Khóa' : 'Mở khóa'}
        variant={selectedAction === 'lock' ? 'danger' : 'primary'}
        isLoading={isSubmitting}
        onClose={() => setSelectedAction(null)}
        onConfirm={confirmAction}
      />
    </div>
  )
}
