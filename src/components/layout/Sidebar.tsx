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
      'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer',
      isActive
        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 shadow-sm border border-brand-200/60 dark:border-brand-800/60'
        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100',
    )

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200/80 bg-white/95 p-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/95 transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col justify-between shadow-xs',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2 pt-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              {user?.role === 'admin' ? 'Quản trị hệ thống' : 'Bảng điều khiển'}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            )}
          </div>

          <nav className="flex flex-col gap-2">
            {user?.role === 'admin' ? (
              <>
                <NavLink to="/admin/dashboard" className={linkClass} onClick={onClose}>
                  <span className="text-lg transition-transform group-hover:scale-110">📊</span>
                  <span>Dashboard Tổng quan</span>
                </NavLink>

                <NavLink to="/admin/tutor-applications" className={linkClass} onClick={onClose}>
                  <span className="text-lg transition-transform group-hover:scale-110">👨‍🏫</span>
                  <span>Duyệt hồ sơ Gia sư</span>
                </NavLink>

                <NavLink to="/admin/subjects" className={linkClass} onClick={onClose}>
                  <span className="text-lg transition-transform group-hover:scale-110">📚</span>
                  <span>Quản lý Môn học</span>
                </NavLink>

                <NavLink to="/admin/complaints" className={linkClass} onClick={onClose}>
                  <span className="text-lg transition-transform group-hover:scale-110">⚠️</span>
                  <span>Xử lý Khiếu nại</span>
                </NavLink>

                <NavLink to="/admin/users" className={linkClass} onClick={onClose}>
                  <span className="text-lg transition-transform group-hover:scale-110">👥</span>
                  <span>Quản lý Người dùng</span>
                </NavLink>
              </>
            ) : (
              <NavLink to="/users" className={linkClass} onClick={onClose}>
                <span className="text-lg transition-transform group-hover:scale-110">👥</span>
                <span>Danh sách Người dùng</span>
              </NavLink>
            )}
          </nav>
        </div>

        {user && (
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/30 p-3.5 border border-slate-200/70 dark:from-slate-800/60 dark:to-slate-900/60 dark:border-slate-800 flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-brand-600/20">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {user.name}
              </span>
              <span className="text-xs text-slate-500 truncate">{user.email}</span>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
