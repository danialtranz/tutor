import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/ToastContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { authApi } from './auth.api'
import type { RegisterStudentPayload } from './auth.types'

export function StudentRegisterPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState<RegisterStudentPayload>({
    name: '',
    email: '',
    password: '',
    phone: '',
    gradeLevel: '',
    learningNeeds: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid =
    form.name.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.phone.trim() &&
    form.gradeLevel.trim() &&
    form.learningNeeds.trim()

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (form.password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu phải trùng khớp')
      return
    }

    if (!form.email.includes('@')) {
      setError('Địa chỉ email không hợp lệ')
      return
    }

    setIsSubmitting(true)
    try {
      await authApi.registerStudent(form)
      toast.success('Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.')
      navigate('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <h1 className="text-2xl font-semibold">Đăng ký Học viên</h1>
        <p className="mt-2 text-sm text-gray-500">
          Tạo tài khoản học viên để tìm gia sư và quản lý lịch học.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            label="Họ và tên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <Input
            label="Lớp / Trình độ"
            value={form.gradeLevel}
            onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
            required
          />
          <Input
            label="Mật khẩu"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">Nhu cầu học tập</label>
            <textarea
              rows={4}
              value={form.learningNeeds}
              onChange={(e) => setForm({ ...form, learningNeeds: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          {error && <p className="md:col-span-2 text-sm text-rose-600">{error}</p>}

          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" loading={isSubmitting} disabled={!isValid || isSubmitting}>
              Đăng ký học viên
            </Button>
            <button
              type="button"
              className="text-sm text-gray-500 underline-offset-2 hover:text-gray-700"
              onClick={() => navigate('/login')}
            >
              Đã có tài khoản? Đăng nhập
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}
