import { useEffect, useState } from 'react'
import { adminApi } from './admin.api'
import type { DashboardStats } from './admin.types'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await adminApi.getDashboardStats()
      setStats(data)
    } catch {
      setError('Không thể tải số liệu thống kê dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadStats()
  }, [])

  if (error) {
    return <ErrorState message={error} onRetry={() => void loadStats()} />
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          <>
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Tổng Gia Sư
                </p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mt-1">
                  {stats?.totalTutors}
                </h3>
                <span className="inline-block mt-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                  +{stats?.monthlyGrowthPercent}% tháng này
                </span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center text-2xl">
                👨‍🏫
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Tổng Học Viên
                </p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mt-1">
                  {stats?.totalStudents}
                </h3>
                <span className="inline-block mt-1 text-xs font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
                  Hoạt động tích cực
                </span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-2xl">
                🎓
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Hồ Sơ Đợi Duyệt
                </p>
                <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                  {stats?.pendingTutorApplications}
                </h3>
                <span className="inline-block mt-1 text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
                  Cần xử lý ngay
                </span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-2xl">
                ⏳
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Khiếu Nại Mới
                </p>
                <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                  {stats?.openComplaints}
                </h3>
                <span className="inline-block mt-1 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">
                  Đang mở
                </span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center text-2xl">
                ⚠️
              </div>
            </div>
          </>
        )}
      </div>

      {/* SVG Analytics Chart & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Thống kê Nhu cầu Học tập & Gia sư
              </h3>
              <p className="text-xs text-gray-500">Biểu đồ lượt đặt lớp và đăng ký gia sư 6 tháng gần nhất</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-full">
              Năm 2026
            </span>
          </div>

          {/* Simple Clean Responsive Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-2 px-4 border-b border-gray-100 dark:border-gray-800">
            {stats?.chartData.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  {/* Bookings bar */}
                  <div
                    style={{ height: `${(item.bookings / 500) * 100}%` }}
                    className="w-1/2 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md relative group"
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-[10px] py-0.5 px-1.5 rounded z-10 whitespace-nowrap">
                      {item.bookings} lớp
                    </span>
                  </div>
                  {/* Applications bar */}
                  <div
                    style={{ height: `${(item.applications / 500) * 100}%` }}
                    className="w-1/2 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-md relative group"
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-[10px] py-0.5 px-1.5 rounded z-10 whitespace-nowrap">
                      {item.applications} hồ sơ
                    </span>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-500">{item.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-indigo-600 inline-block" />
              <span>Số lượng Lớp học đã đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-emerald-500 inline-block" />
              <span>Hồ sơ Gia sư đăng ký</span>
            </div>
          </div>
        </div>

        {/* System Activity Summary Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">
              Nhật ký hệ thống gần đây
            </h3>
            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    Gia sư Lê Hoàng Nam đã được duyệt thành công
                  </p>
                  <span className="text-gray-400">10 phút trước</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    Nhận 1 hồ sơ gia sư mới: Trần Thị Thu Hà
                  </p>
                  <span className="text-gray-400">45 phút trước</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    Môn học mới &quot;Luyện thi IELTS&quot; đã cập nhật bộ lọc
                  </p>
                  <span className="text-gray-400">2 giờ trước</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    Khiếu nại CMP-201 được tiếp nhận bởi quản trị viên
                  </p>
                  <span className="text-gray-400">4 giờ trước</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
            <span className="text-xs text-gray-500 font-medium">Trạng thái hệ thống: <strong className="text-emerald-600">Hoạt động bình thường</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}
