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
      <div className="from-brand-700 via-brand-600 shadow-brand-600/15 relative overflow-hidden rounded-3xl bg-gradient-to-r to-indigo-600 p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Hệ thống quản trị GiaSưConnect
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Chào mừng trở lại, Quản trị viên! 👋
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-white/80">
              Theo dõi hiệu năng hệ thống, phê duyệt hồ sơ gia sư và quản lý hoạt động học
              tập toàn diện.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Button
              variant="gradient"
              onClick={() => navigate('/admin/tutor-applications')}
              className="shadow-lg shadow-black/20"
            >
              📋 Duyệt hồ sơ ({stats?.currentSnapshot.pendingTutorApprovals || 0})
            </Button>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl"
        />
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <div>
                <p className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">
                  Tổng lượt đặt lớp
                </p>
                <h3 className="mt-1 text-3xl font-black text-slate-900 dark:text-slate-100">
                  {stats?.periodMetrics.bookingStatistics.total}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <span>✓</span> Tổng lượt đặt lớp trong kỳ
                </div>
              </div>
              <div className="bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-xs">
                👨‍🏫
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <div>
                <p className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">
                  Mục tiêu đủ điều kiện
                </p>
                <h3 className="mt-1 text-3xl font-black text-slate-900 dark:text-slate-100">
                  {stats?.currentSnapshot.goalCompletionRate.eligibleGoals}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-200/60 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-800/60 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <span>✨</span> Mục tiêu đủ điều kiện
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-3xl text-indigo-600 shadow-xs dark:bg-indigo-950/60 dark:text-indigo-400">
                🎓
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <div>
                <p className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">
                  Hồ Sơ Chờ Duyệt
                </p>
                <h3 className="mt-1 text-3xl font-black text-amber-600 dark:text-amber-400">
                  {stats?.currentSnapshot.pendingTutorApprovals}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-200/60 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:border-amber-800/60 dark:bg-amber-950/60 dark:text-amber-300">
                  <span>⏱️</span> Cần xử lý ngay
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-3xl text-amber-600 shadow-xs dark:bg-amber-950/60 dark:text-amber-400">
                ⏳
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <div>
                <p className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">
                  Khiếu Nại Mới
                </p>
                <h3 className="mt-1 text-3xl font-black text-rose-600 dark:text-rose-400">
                  {stats?.currentSnapshot.openComplaints}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-rose-200/60 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:border-rose-800/60 dark:bg-rose-950/60 dark:text-rose-300">
                  <span>🔔</span> Đang chờ giải quyết
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-3xl text-rose-600 shadow-xs dark:bg-rose-950/60 dark:text-rose-400">
                ⚠️
              </div>
            </div>
          </>
        )}
      </div>

      {/* Full-width Analytics Chart */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Các môn học được đặt nhiều nhất
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Dữ liệu trong khoảng thời gian dashboard trả về
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            🗓️ Kỳ thống kê
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex h-64 items-end justify-between gap-3 border-b border-slate-100 px-2 pt-8 pb-3 sm:px-6 dark:border-slate-800">
          {stats?.periodMetrics.popularSubjects.map((item) => (
            <div
              key={item.subjectId}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div className="flex h-full w-full items-end justify-center gap-1.5">
                {/* Bookings bar */}
                <div
                  style={{
                    height: `${Math.max((item.bookingCount / Math.max(...(stats?.periodMetrics.popularSubjects.map((subject) => subject.bookingCount) ?? [1]))) * 100, 4)}%`,
                  }}
                  className="from-brand-600 group relative w-full rounded-t-lg bg-gradient-to-t to-indigo-500 transition-all duration-300 hover:brightness-110"
                >
                  <span className="absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[11px] font-bold whitespace-nowrap text-white shadow-lg group-hover:block">
                    {item.bookingCount} lượt đặt
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {item.subjectName}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-8 text-xs font-bold text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="bg-brand-600 inline-block h-3 w-3 rounded-full shadow-xs" />
            <span>Số lượt đặt lớp</span>
          </div>
        </div>
      </div>
    </div>
  )
}
