import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from './auth.store'

export function RegisterTutorPage() {
  const navigate = useNavigate()
  const { registerTutor, status, error } = useAuthStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [qualification, setQualification] = useState('Đại học Sư Phạm')
  const [experienceYears, setExperienceYears] = useState(2)
  const [bio, setBio] = useState('')
  const [subjectsStr, setSubjectsStr] = useState('Toán, Lý, Hóa')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await registerTutor({
        name,
        email,
        password,
        phone,
        qualification,
        experienceYears,
        bio,
        subjects: subjectsStr.split(',').map((s) => s.trim()),
      })
      navigate('/')
    } catch {
      // Handled in store
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-xl space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">
            Đăng ký làm Gia sư
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gia nhập đội ngũ gia sư uy tín và kết nối với hàng nghìn học viên
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Họ và tên gia sư"
            placeholder="Trần Văn Gia Sử"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="giasu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Số điện thoại"
              placeholder="0987654321"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Trình độ / Bằng cấp chính"
              placeholder="Cử nhân Sư phạm / Thạc sĩ..."
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              required
            />
            <Select
              label="Số năm kinh nghiệm"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              options={[
                { label: 'Chưa có kinh nghiệm (Mới tốt nghiệp)', value: 0 },
                { label: '1 năm kinh nghiệm', value: 1 },
                { label: '2-3 năm kinh nghiệm', value: 2 },
                { label: '4-5 năm kinh nghiệm', value: 4 },
                { label: 'Trên 5 năm kinh nghiệm', value: 6 },
              ]}
            />
          </div>

          <Input
            label="Môn học giảng dạy (phân cách bằng dấu phẩy)"
            placeholder="Toán lớp 10, Tiếng Anh giao tiếp, Lý 12"
            value={subjectsStr}
            onChange={(e) => setSubjectsStr(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Giới thiệu bản thân & Phương pháp dạy
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Mô tả kinh nghiệm, thành tích học tập và phong cách giảng dạy..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
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
            Gửi Hồ sơ Đăng ký Gia sư
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
