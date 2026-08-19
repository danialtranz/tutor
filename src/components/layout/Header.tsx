import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  const { user, logout } = useAuthStore()
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  const roleBadges: Record<string, string> = {
    admin: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    tutor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    student: 'bg-brand-100 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800',
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 sm:px-6">
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
              aria-label="Toggle Sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <NavLink to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/users') : '/'} className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-lg shadow-md shadow-brand-600/25 transition-transform group-hover:scale-105">
              🎓
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold bg-gradient-to-r from-slate-900 via-brand-700 to-indigo-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                GiaSưConnect
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                Tutor & Learning
              </span>
            </div>
          </NavLink>

        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <select
            aria-label="Language"
            value={i18n.resolvedLanguage}
            onChange={(e) => void i18n.changeLanguage(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-700 transition-colors focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            {supportedLocales.map((l) => (
              <option key={l} value={l}>
                🌐 {l.toUpperCase()}
              </option>
            ))}
          </select>

          {user ? (
            <div className="flex items-center gap-3">
              {/* User badge info */}
              <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 text-white font-bold text-sm shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {user.name}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 text-center ${roleBadges[user.role] || 'bg-slate-100 text-slate-700'}`}>
                    {user.role === 'admin' ? 'Quản trị viên' : user.role === 'tutor' ? 'Gia sư' : 'Học viên'}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChangePasswordOpen(true)}
                title="Đổi mật khẩu"
              >
                🔒 Mật khẩu
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                {t('nav.logout')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="gradient" onClick={() => navigate('/login')}>
                Đăng nhập
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/register/student')}
              >
                Đăng ký Học viên
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Change password modal for logged-in users */}
      {user && (
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      )}
    </>
  )
}
