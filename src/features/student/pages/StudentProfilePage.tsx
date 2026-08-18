import { useState, useEffect } from 'react'
import { User, Mail, Phone, Save, ShieldCheck } from 'lucide-react'
import { useCurrentUser } from '../hooks/useCurrentUser'

export default function StudentProfilePage() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')

  // 1. Fetch Current User Profile
  const { data: user, isLoading, isError } = useCurrentUser()
  console.log('PROFILE USER:', user)
  console.log('PROFILE ERROR:', isError)

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '')
      setPhone(user.phone || '')
    }
  }, [user])

  // Update Profile Mutation
  // const updateProfileMutation = useMutation({
  //   mutationFn: (payload: { fullName: string; phone?: string }) =>
  //     http.put<UserProfile>('/users/me', payload),
  //   onSuccess: () => {
  //     alert('Cập nhật thông tin thành công!')
  //     queryClient.invalidateQueries({ queryKey: ['current-user'] })
  //   },
  // })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // updateProfileMutation.mutate({ fullName, phone })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !user) {
    return <div>Không thể tải thông tin người dùng</div>
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
          Hồ sơ cá nhân
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Quản lý thông tin tài khoản và xem đánh giá uy tín từ các gia sư.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Cột trái: Avatar & Thống kê ngắn */}
        <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="relative">
            <img
              src={'https://api.dicebear.com/7.x/avataaars/svg?seed=student123'}
              alt="Avatar"
              className="h-24 w-24 rounded-full border-2 border-indigo-100 object-cover ring-4 ring-gray-50 dark:border-indigo-950/60 dark:ring-gray-800"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {user?.fullName}
            </h3>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />{' '}
              Học viên
            </span>
          </div>
        </div>

        {/* Cột phải: Form cập nhật thông tin */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-5 border-b border-gray-100 pb-3 text-base font-bold text-gray-900 dark:border-gray-800 dark:text-gray-100">
            Thông tin chi tiết
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Họ và tên
              </label>
              <div className="relative">
                <User className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-3 pl-9 text-sm text-gray-900 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Email (Cố định)
              </label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-3 pl-9 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-3 pl-9 text-sm text-gray-900 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                  placeholder="0912345678"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                // disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {/* {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'} */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
