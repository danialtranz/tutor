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
    { key: 'id', header: 'Mã người dùng', render: (row) => <span className="font-mono text-xs font-bold text-slate-400">{row.id}</span> },
    {
      key: 'name',
      header: 'Tên & Email',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{row.name}</p>
            <span className="text-xs text-slate-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Vai trò',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          row.role === 'admin'
            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
            : row.role === 'tutor'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
            : 'bg-brand-100 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300'
        }`}>
          {row.role === 'admin' ? 'Quản trị viên' : row.role === 'tutor' ? 'Gia sư' : 'Học viên'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row) => (
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
          row.status === 'active'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200'
            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200'
        }`}>
          {row.status === 'active' ? '🟢 Hoạt động' : '🔴 Bị khóa'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (row) => (
        <Button
          size="sm"
          variant={row.status === 'active' ? 'danger' : 'outline'}
          onClick={() => handleAction(row, row.status === 'active' ? 'lock' : 'unlock')}
        >
          {row.status === 'active' ? '🔒 Khóa' : '🔓 Mở khóa'}
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Quản lý Người dùng</h2>
          <p className="text-xs text-slate-500 mt-1">Danh sách người dùng toàn hệ thống, quản lý quyền hạn và khóa/mở khóa tài khoản</p>
        </div>
        <Input
          placeholder="🔍 Tìm theo email hoặc tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>

      <Table columns={columns} data={users} keyExtractor={(row) => row.id} isLoading={isLoading} emptyMessage="Không có người dùng nào" />

      <ConfirmDialog
        isOpen={!!selectedUser && !!selectedAction}
        title={selectedAction === 'lock' ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản'}
        message={`Bạn có chắc chắn muốn ${selectedAction === 'lock' ? 'khóa' : 'mở khóa'} tài khoản ${selectedUser?.name}?`}
        confirmText={selectedAction === 'lock' ? 'Khóa Tài Khoản' : 'Mở Khóa Tài Khoản'}
        variant={selectedAction === 'lock' ? 'danger' : 'primary'}
        isLoading={isSubmitting}
        onClose={() => setSelectedAction(null)}
        onConfirm={confirmAction}
      />
    </div>
  )
}
