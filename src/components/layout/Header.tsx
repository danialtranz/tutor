import { useNavigate, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/features/auth/auth.store'
import { supportedLocales } from '@/lib/i18n'
import { Button } from '@/components/ui/Button'

export interface HeaderProps {
  onToggleSidebar?: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80 sm:px-6">
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
        )}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black text-lg shadow-md shadow-indigo-500/20">
            GS
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            GiaSưConnect
          </span>
        </NavLink>
      </div>

      <div className="flex items-center gap-3">
        <select
          aria-label="Language"
          value={i18n.resolvedLanguage}
          onChange={(e) => void i18n.changeLanguage(e.target.value)}
          className="h-9 rounded-lg border border-gray-300 bg-white px-2 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >
          {supportedLocales.map((l) => (
            <option key={l} value={l}>
              {l.toUpperCase()}
            </option>
          ))}
        </select>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {user.name}
              </span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 capitalize font-medium">
                {user.role || 'Thành viên'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              {t('nav.logout')}
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => navigate('/login')}>
            Đăng nhập
          </Button>
        )}
      </div>
    </header>
  )
}
