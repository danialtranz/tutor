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
              📋 Duyệt hồ sơ ({stats?.currentSnapshot.pendingTutorApprovals || 0})
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
                  Tổng lượt đặt lớp
                </p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  {stats?.periodMetrics.bookingStatistics.total}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                  <span>✓</span> Tổng lượt đặt lớp trong kỳ
                </div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center text-3xl shadow-xs">
                👨‍🏫
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Mục tiêu đủ điều kiện
                </p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  {stats?.currentSnapshot.goalCompletionRate.eligibleGoals}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
                  <span>✨</span> Mục tiêu đủ điều kiện
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
                  {stats?.currentSnapshot.pendingTutorApprovals}
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
                  {stats?.currentSnapshot.openComplaints}
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
                Các môn học được đặt nhiều nhất
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Dữ liệu trong khoảng thời gian dashboard trả về</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              🗓️ Kỳ thống kê
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-3 px-2 sm:px-6 border-b border-slate-100 dark:border-slate-800">
            {stats?.periodMetrics.popularSubjects.map((item) => (
              <div key={item.subjectId} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  {/* Bookings bar */}
                  <div
                    style={{ height: `${Math.max((item.bookingCount / Math.max(...(stats?.periodMetrics.popularSubjects.map((subject) => subject.bookingCount) ?? [1]))) * 100, 4)}%` }}
                    className="w-full bg-gradient-to-t from-brand-600 to-indigo-500 rounded-t-lg relative group transition-all duration-300 hover:brightness-110"
                  >
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[11px] font-bold py-1 px-2 rounded-md z-10 whitespace-nowrap shadow-lg">
                      {item.bookingCount} lượt đặt
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.subjectName}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-8 mt-5 text-xs font-bold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-brand-600 inline-block shadow-xs" />
              <span>Số lượt đặt lớp</span>
            </div>
          </div>
        </div>

        {/* System Activity Log */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-5">Nhật ký quản trị</h3>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              API contract v2 chưa cung cấp endpoint nhật ký quản trị, nên dữ liệu này không được hiển thị giả lập.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Trạng thái máy chủ:</span>
              <span className="text-slate-400">Không có endpoint health trong phạm vi dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
