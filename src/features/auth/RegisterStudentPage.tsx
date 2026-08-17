import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from './auth.store'

export function RegisterStudentPage() {
  const navigate = useNavigate()
  const { registerStudent, status, error } = useAuthStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [grade, setGrade] = useState('Lớp 10')
  const [address, setAddress] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await registerStudent({ name, email, password, phone, grade, address })
      navigate('/')
    } catch {
      // Handled in store
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-lg space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">
            Đăng ký tài khoản Học viên
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Tìm kiếm gia sư giỏi và bắt đầu lộ trình học tập hiệu quả
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="hocvien@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Số điện thoại"
              placeholder="0912345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Khối / Lớp học"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              options={[
                { label: 'Tiểu học (Lớp 1-5)', value: 'Tiểu học' },
                { label: 'THCS (Lớp 6-9)', value: 'THCS' },
                { label: 'Lớp 10', value: 'Lớp 10' },
                { label: 'Lớp 11', value: 'Lớp 11' },
                { label: 'Lớp 12 / Ôn thi ĐH', value: 'Lớp 12' },
                { label: 'Sinh viên / Người đi làm', value: 'Đại học' },
              ]}
            />
            <Input
              label="Địa chỉ sinh sống"
              placeholder="Quận / Huyện, TP"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <Input
            label="Mật khẩu"
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full mt-2"
            loading={status === 'loading'}
          >
            Hoàn tất Đăng ký Học viên
          </Button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-800">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  )
}
