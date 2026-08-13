import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { useAuthStore } from '@/features/auth/auth.store'

export interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { user } = useAuthStore()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
      isActive
        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/60',
    )

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 transition-transform duration-200 ease-in-out md:static md:translate-x-0 flex flex-col justify-between',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Điều hướng
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          <nav className="flex flex-col gap-1.5">
            <NavLink to="/" end className={linkClass} onClick={onClose}>
              <span className="text-lg">🏠</span>
              <span>Trang chủ</span>
            </NavLink>

            {user?.role === 'admin' && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-1.5">
                <span className="px-2 text-xs font-bold uppercase tracking-wider text-indigo-500">
                  Quản trị viên
                </span>
                <NavLink to="/admin/dashboard" className={linkClass} onClick={onClose}>
                  <span className="text-lg">📊</span>
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/admin/tutor-applications" className={linkClass} onClick={onClose}>
                  <span className="text-lg">👨‍🏫</span>
                  <span>Duyệt hồ sơ Gia sư</span>
                </NavLink>
                <NavLink to="/admin/subjects" className={linkClass} onClick={onClose}>
                  <span className="text-lg">📚</span>
                  <span>Quản lý Môn học</span>
                </NavLink>
                <NavLink to="/admin/complaints" className={linkClass} onClick={onClose}>
                  <span className="text-lg">⚠️</span>
                  <span>Xử lý Khiếu nại</span>
                </NavLink>
              </div>
            )}
          </nav>
        </div>

        {user && (
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user.name}
              </span>
              <span className="text-xs text-gray-500 truncate">{user.email}</span>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
