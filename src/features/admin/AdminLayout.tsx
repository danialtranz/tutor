import { Suspense } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { clsx } from 'clsx'

export function AdminLayout() {
  const adminNavLink = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all',
      isActive
        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
    )

  return (
    <div className="space-y-6">
      {/* Top Header bar for Admin Portal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>🛡️</span> Portal Quản Trị Viên (Admin)
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Quản lý hệ thống, kiểm duyệt gia sư, danh mục môn học và giải quyết khiếu nại
          </p>
        </div>

        {/* Quick Nav Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <NavLink to="/admin/dashboard" className={adminNavLink}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/admin/tutor-applications" className={adminNavLink}>
            👨‍🏫 Duyệt Gia Sư
          </NavLink>
          <NavLink to="/admin/subjects" className={adminNavLink}>
            📚 Môn Học
          </NavLink>
          <NavLink to="/admin/complaints" className={adminNavLink}>
            ⚠️ Khiếu Nại
          </NavLink>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  )
}
