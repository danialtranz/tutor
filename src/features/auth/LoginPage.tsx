import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from './auth.store'
import type { UserRole } from './auth.types'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, status, error } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('student')

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password, role: selectedRole })
      navigate(selectedRole === 'admin' ? '/admin/dashboard' : from, { replace: true })
    } catch {
      // Handled in store error state
    }
  }

  const handleQuickLogin = (role: UserRole) => {
    let mockEmail = 'hocvien@tutor.com'
    if (role === 'tutor') mockEmail = 'giasu@tutor.com'
    if (role === 'admin') mockEmail = 'admin@tutor.com'

    setEmail(mockEmail)
    setPassword('password')
    setSelectedRole(role)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-xl shadow-lg shadow-indigo-500/30">
            GS
          </div>
          <h2 className="mt-4 text-2xl font-black text-gray-900 dark:text-gray-100">
            Đăng nhập hệ thống
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Kết Nối Gia Sư — Học Tập Hiệu Quả
          </p>
        </div>

        {/* Quick role presets */}
        <div className="flex flex-col gap-2 p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
            ⚡ Thử nghiệm nhanh tài khoản demo:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all ${
                selectedRole === 'student'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
              }`}
            >
              Học viên
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('tutor')}
              className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all ${
                selectedRole === 'tutor'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
              }`}
            >
              Gia sư
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all ${
                selectedRole === 'admin'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Địa chỉ Email"
            type="email"
            placeholder="nhap@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full"
            loading={status === 'loading'}
          >
            Đăng nhập
          </Button>
        </form>

        <div className="space-y-2 text-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
          <p>Chưa có tài khoản?</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register/student"
              className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Đăng ký Học viên
            </Link>
            <span>•</span>
            <Link
              to="/register/tutor"
              className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Đăng ký Gia sư
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
