import { Calendar, Search, Target, User } from 'lucide-react'
import { Link } from 'react-router-dom'

export function QuickActions() {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
        Lối truy cập nhanh
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Link
          to="/student/tutors"
          className="group space-y-2 rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all duration-200 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/60">
            <Search className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-gray-900 dark:text-gray-100">Tìm Gia Sư</p>
        </Link>

        <Link
          to="/student/schedule"
          className="group space-y-2 rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:border-emerald-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-500"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-all duration-200 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950/60">
            <Calendar className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
            Lịch Học Của Tôi
          </p>
        </Link>

        <Link
          to="/student/progress"
          className="group space-y-2 rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:border-purple-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-500"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-all duration-200 group-hover:bg-purple-600 group-hover:text-white dark:bg-purple-950/60">
            <Target className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
            Mục Tiêu Học Tập
          </p>
        </Link>

        <Link
          to="/student/profile"
          className="group space-y-2 rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:border-amber-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-amber-500"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-all duration-200 group-hover:bg-amber-600 group-hover:text-white dark:bg-amber-950/60">
            <User className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
            Hồ Sơ Cá Nhân
          </p>
        </Link>
      </div>
    </div>
  )
}

export default QuickActions
