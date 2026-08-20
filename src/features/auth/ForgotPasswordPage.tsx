import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/ToastContext'
import { authApi } from './auth.api'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Vui lòng nhập địa chỉ email')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await authApi.forgotPassword({ email })
      setSubmitted(true)
      toast.success('Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quên mật khẩu?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Nhập email của bạn và chúng tôi sẽ gửi liên kết hướng dẫn đặt lại mật khẩu.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <span className="text-3xl">✉️</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Chúng tôi đã gửi hướng dẫn tới <strong className="text-gray-900 dark:text-white">{email}</strong>. Vui lòng kiểm tra hộp thư đến của bạn.
            </p>
            <div className="pt-4">
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Quay lại đăng nhập
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <Input
                label="Địa chỉ Email"
                type="email"
                required
                placeholder="vd: user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error || undefined}
              />
            </div>

            <div>
              <Button type="submit" className="w-full" loading={loading}>
                Gửi yêu cầu đặt lại mật khẩu
              </Button>
            </div>

            <div className="text-center text-sm">
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                ← Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
