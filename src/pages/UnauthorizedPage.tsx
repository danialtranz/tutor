import { Link } from 'react-router-dom'

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 p-8 text-center">
      <p className="text-6xl font-black text-rose-600">403</p>
      <h1 className="text-2xl font-semibold text-gray-900">Không có quyền truy cập</h1>
      <p className="max-w-xl text-sm text-gray-500">
        Bạn không có quyền để truy cập trang này. Vui lòng đăng nhập bằng tài khoản có vai trò phù hợp hoặc quay về trang chủ.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/"
          className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Về trang chủ
        </Link>
        <Link
          to="/login"
          className="rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          Đăng nhập lại
        </Link>
      </div>
    </div>
  )
}
