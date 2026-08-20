import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { authApi } from './auth.api'

type VerificationState = 'loading' | 'success' | 'error'

function responseMessage(response: Awaited<ReturnType<typeof authApi.verifyEmail>>): string {
  return typeof response === 'string' ? response : response.message
}

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const requested = useRef(false)
  const [state, setState] = useState<VerificationState>(token ? 'loading' : 'error')
  const [message, setMessage] = useState(token ? 'Đang xác minh địa chỉ email của bạn...' : 'Liên kết xác minh không hợp lệ hoặc thiếu mã token.')

  useEffect(() => {
    if (!token || requested.current) return
    requested.current = true

    authApi.verifyEmail(token)
      .then((response) => {
        if (typeof response !== 'string' && !response.success) {
          throw new Error(response.message)
        }
        setState('success')
        setMessage(responseMessage(response) || 'Email của bạn đã được xác minh thành công.')
      })
      .catch((error: unknown) => {
        setState('error')
        setMessage(error instanceof Error ? error.message : 'Không thể xác minh email. Vui lòng thử lại.')
      })
  }, [token])

  const isLoading = state === 'loading'
  const isSuccess = state === 'success'

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-10">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl ${isLoading ? 'bg-brand-100 dark:bg-brand-950/50' : isSuccess ? 'bg-emerald-100 dark:bg-emerald-950/50' : 'bg-rose-100 dark:bg-rose-950/50'}`}>
          {isLoading ? '⏳' : isSuccess ? '✓' : '!'}
        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-white">
          {isLoading ? 'Đang xác minh email' : isSuccess ? 'Xác minh thành công' : 'Không thể xác minh email'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>

        {!isLoading && (
          <Link to="/login" className="mt-8 inline-block">
            <Button variant={isSuccess ? 'gradient' : 'outline'}>
              Đi tới đăng nhập
            </Button>
          </Link>
        )}
      </section>
    </main>
  )
}
