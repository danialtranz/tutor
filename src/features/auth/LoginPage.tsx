import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from './auth.store'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface LocationState {
  from?: { pathname: string }
}

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { login, status, error } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const redirectTo = (location.state as LocationState)?.from?.pathname ?? '/'

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await login({ email, password })
      const currentUser = useAuthStore.getState().user
      if (currentUser?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true })
        return
      }
      navigate(redirectTo, { replace: true })
    } catch {
      /* error surfaced via store */
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-2xl text-white shadow-xl shadow-brand-600/30">
            🎓
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('auth.login')}
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Chào mừng bạn quay trở lại với GiaSưConnect
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-500">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              Ghi nhớ đăng nhập
            </label>
            <Link
              to="/forgot-password"
              className="font-bold text-brand-600 hover:underline dark:text-brand-400"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold text-center">
              {t('auth.invalidCredentials')}
            </div>
          )}

          <Button type="submit" variant="gradient" size="lg" loading={status === 'loading'} className="mt-2 w-full">
            {t('auth.login')}
          </Button>

          <div className="mt-4 text-center text-xs text-slate-500">
            Chưa có tài khoản?{' '}
            <Link to="/register/student" className="font-bold text-brand-600 hover:underline dark:text-brand-400">
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
