import { useEffect, useState } from 'react'
import { adminApi } from './admin.api'
import type { DashboardStats } from './admin.types'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 p-6 sm:p-8 text-white shadow-xl shadow-brand-600/15">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Hệ thống quản trị GiaSưConnect
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Chào mừng trở lại, Quản trị viên! 👋
            </h1>
            <p className="mt-1.5 text-sm text-white/80 max-w-xl">
              Theo dõi hiệu năng hệ thống, phê duyệt hồ sơ gia sư và quản lý hoạt động học tập toàn diện.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button
              variant="gradient"
              onClick={() => navigate('/admin/tutor-applications')}
              className="shadow-lg shadow-black/20"
            >
              📋 Duyệt hồ sơ ({stats?.pendingTutorApplications || 0})
            </Button>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden="true" className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </>
        ) : (
          <>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Tổng Gia Sư
                </p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  {stats?.totalTutors}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                  <span>↑</span> +{stats?.monthlyGrowthPercent}% tháng này
                </div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center text-3xl shadow-xs">
                👨‍🏫
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Tổng Học Viên
                </p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  {stats?.totalStudents}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
                  <span>✨</span> Hoạt động tích cực
                </div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl shadow-xs">
                🎓
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Hồ Sơ Chờ Duyệt
                </p>
                <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                  {stats?.pendingTutorApplications}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-200/60 dark:border-amber-800/60">
                  <span>⏱️</span> Cần xử lý ngay
                </div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl shadow-xs">
                ⏳
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Khiếu Nại Mới
                </p>
                <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
                  {stats?.openComplaints}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 px-2.5 py-1 rounded-full border border-rose-200/60 dark:border-rose-800/60">
                  <span>🔔</span> Đang chờ giải quyết
                </div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-3xl shadow-xs">
                ⚠️
              </div>
            </div>
          </>
        )}
      </div>

      {/* Analytics Chart & Activity Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Thống kê Lượt đăng ký & Đặt lớp học
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Dữ liệu theo dõi 6 tháng gần nhất năm 2026</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              🗓️ 6 Tháng vừa qua
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-3 px-2 sm:px-6 border-b border-slate-100 dark:border-slate-800">
            {stats?.chartData.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  {/* Bookings bar */}
                  <div
                    style={{ height: `${(item.bookings / 500) * 100}%` }}
                    className="w-1/2 bg-gradient-to-t from-brand-600 to-indigo-500 rounded-t-lg relative group transition-all duration-300 hover:brightness-110"
                  >
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[11px] font-bold py-1 px-2 rounded-md z-10 whitespace-nowrap shadow-lg">
                      {item.bookings} lớp
                    </span>
                  </div>
                  {/* Applications bar */}
                  <div
                    style={{ height: `${(item.applications / 500) * 100}%` }}
                    className="w-1/2 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg relative group transition-all duration-300 hover:brightness-110"
                  >
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[11px] font-bold py-1 px-2 rounded-md z-10 whitespace-nowrap shadow-lg">
                      {item.applications} hồ sơ
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-8 mt-5 text-xs font-bold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-brand-600 inline-block shadow-xs" />
              <span>Số lượt đặt lớp</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block shadow-xs" />
              <span>Hồ sơ gia sư mới</span>
            </div>
          </div>
        </div>

        {/* System Activity Log */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Nhật ký quản trị gần đây
              </h3>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    Duyệt hồ sơ Gia sư Lê Hoàng Nam
                  </p>
                  <span className="text-slate-400 text-[11px]">10 phút trước</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center text-sm font-bold">
                  ⏳
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    Hồ sơ gia sư mới: Trần Thị Thu Hà
                  </p>
                  <span className="text-slate-400 text-[11px]">45 phút trước</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400 flex items-center justify-center text-sm font-bold">
                  📚
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    Cập nhật môn học Luyện thi IELTS
                  </p>
                  <span className="text-slate-400 text-[11px]">2 giờ trước</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center text-sm font-bold">
                  ⚠️
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    Tiếp nhận khiếu nại CMP-201
                  </p>
                  <span className="text-slate-400 text-[11px]">4 giờ trước</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Trạng thái máy chủ:</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/60">
                🟢 Hoạt động ổn định
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
