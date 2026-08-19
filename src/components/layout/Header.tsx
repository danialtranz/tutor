import { useState } from 'react'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Globe, Bell, LogOut, Menu, GraduationCap, Lock } from 'lucide-react'
import { useAuthStore } from '@/features/auth/auth.store'
import { supportedLocales } from '@/lib/i18n'
import { Button } from '@/components/ui/Button'
import { ChangePasswordModal } from '@/features/auth/ChangePasswordModal'

export interface HeaderProps {
  onToggleSidebar?: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  const isTutorDark =
    user?.role === 'tutor' &&
    (location.pathname.startsWith('/tutor') || location.pathname === '/users')

  const roleBadges: Record<string, string> = {
    admin: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    tutor: isTutorDark
      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    student: 'bg-brand-100 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800',
  }

  return (
    <>
      <header
        className={
          isTutorDark
            ? 'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0b0e14]/95 px-4 backdrop-blur-md sm:px-6'
            : 'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 sm:px-6'
        }
      >
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className={
                isTutorDark
                  ? 'cursor-pointer rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white md:hidden'
                  : 'cursor-pointer rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden'
              }
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
          <NavLink
            to={user ? (user.role === 'admin' ? '/admin/dashboard' : user.role === 'tutor' ? '/tutor/profile' : '/users') : '/'}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-lg font-black text-white shadow-md shadow-brand-600/25 transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span
                className={
                  isTutorDark
                    ? 'bg-gradient-to-r from-white via-brand-200 to-indigo-300 bg-clip-text text-lg font-extrabold text-transparent'
                    : 'bg-gradient-to-r from-slate-900 via-brand-700 to-indigo-600 bg-clip-text text-lg font-extrabold text-transparent dark:from-white dark:to-slate-300'
                }
              >
                GiaSưConnect
              </span>
              <span className="-mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Tutor & Learning
              </span>
            </div>
          </NavLink>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <Globe className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <select
              aria-label="Language"
              value={i18n.resolvedLanguage}
              onChange={(e) => void i18n.changeLanguage(e.target.value)}
              className={
                isTutorDark
                  ? 'h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] pl-8 pr-2.5 text-xs font-semibold text-slate-300 outline-none focus:border-brand-500/40'
                  : 'h-9 rounded-xl border border-slate-200 bg-slate-50 px-2.5 pl-8 text-xs font-semibold text-slate-700 transition-colors focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }
            >
              {supportedLocales.map((l) => (
                <option key={l} value={l}>
                  {l.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {user && (
            <button
              type="button"
              className={
                isTutorDark
                  ? 'relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 transition hover:text-white'
                  : 'relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:hover:text-slate-200'
              }
              aria-label="Thông báo"
            >
              <Bell className="h-4 w-4" />
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={
                  isTutorDark
                    ? 'hidden items-center gap-3 border-l border-white/[0.08] pl-3 sm:flex'
                    : 'hidden items-center gap-3 border-l border-slate-200 pl-3 dark:border-slate-800 sm:flex'
                }
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className={`text-sm font-bold leading-tight ${isTutorDark ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {user.name}
                  </span>
                  <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-center text-[11px] font-semibold ${roleBadges[user.role] || 'bg-slate-100 text-slate-700'}`}>
                    {user.role === 'admin' ? 'Quản trị viên' : user.role === 'tutor' ? 'Gia sư' : 'Học viên'}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChangePasswordOpen(true)}
                title="Đổi mật khẩu"
                className={isTutorDark ? 'hidden text-slate-400 hover:text-white sm:inline-flex' : 'hidden sm:inline-flex'}
              >
                <Lock className="mr-1.5 h-3.5 w-3.5" />
                Mật khẩu
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className={isTutorDark ? 'border-white/[0.08] bg-transparent text-slate-300 hover:bg-white/5' : undefined}
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5 sm:hidden" />
                <span className="hidden sm:inline">{t('nav.logout')}</span>
                <span className="sm:hidden">Thoát</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="gradient" onClick={() => navigate('/login')}>
                Đăng nhập
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/register/student')}>
                Đăng ký Học viên
              </Button>
            </div>
          )}
        </div>
      </header>

      {user && (
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      )}
    </>
  )
}
