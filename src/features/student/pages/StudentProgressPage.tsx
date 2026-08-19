import { useEffect, useMemo, useState } from 'react'
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Flag,
  Target,
  TrendingUp,
} from 'lucide-react'
import { studentApi } from '@/features/student/api/studentApi'
import type { LearningGoal } from '../types/learningGoal.types'
import { LearningStatus } from '@/constants/enums'

interface Milestone {
  id: number
  learningGoalId: number
  title: string
  description?: string
  targetDate: string
  orderNumber: number
  status: number
}

interface GoalWithMilestones extends LearningGoal {
  milestones?: Milestone[]
}

export default function StudentProgressPage() {
  const [goals, setGoals] = useState<GoalWithMilestones[]>([])
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      setLoading(true)

      const response = await studentApi.getMyGoals()

      const data: GoalWithMilestones[] = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.data)
          ? (response as any).data
          : []

      setGoals(data)

      // Chỉ chọn goal đầu tiên nếu chưa có goal nào được chọn
      if (data.length > 0) {
        setSelectedGoalId((current) => current ?? data[0]?.id ?? null)
      }
    } catch (error) {
      console.error('Không thể tải mục tiêu học tập:', error)
      setGoals([])
    } finally {
      setLoading(false)
    }
  }

  const selectedGoal = useMemo(() => {
    if (!selectedGoalId) return undefined

    return goals.find((goal) => goal.id === selectedGoalId)
  }, [goals, selectedGoalId])

  const milestones = useMemo(() => {
    if (!selectedGoal?.milestones) return []

    return [...selectedGoal.milestones].sort((a, b) => a.orderNumber - b.orderNumber)
  }, [selectedGoal])

  const completedMilestones = milestones.filter(
    (milestone) => milestone.status === LearningStatus.Completed,
  ).length

  const progress =
    milestones.length > 0
      ? Math.round((completedMilestones / milestones.length) * 100)
      : 0

  const nextMilestone = milestones.find((milestone) => milestone.status !== 2)

  const completedGoals = goals.filter((goal) => {
    const goalMilestones = goal.milestones ?? []

    return (
      goalMilestones.length > 0 &&
      goalMilestones.every((milestone) => milestone.status === LearningStatus.Completed)
    )
  }).length

  const totalMilestones = goals.reduce(
    (total, goal) => total + (goal.milestones?.length ?? 0),
    0,
  )

  const totalCompletedMilestones = goals.reduce(
    (total, goal) =>
      total +
      (goal.milestones?.filter(
        (milestone) => milestone.status === LearningStatus.Completed,
      ).length ?? 0),
    0,
  )

  const overallProgress =
    totalMilestones > 0
      ? Math.round((totalCompletedMilestones / totalMilestones) * 100)
      : 0

  const formatDate = (date?: string) => {
    if (!date) return 'Chưa xác định'

    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getDaysRemaining = (date?: string) => {
    if (!date) return null

    const target = new Date(date)
    const today = new Date()

    target.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm font-medium text-gray-500">
          Đang tải tiến độ học tập...
        </div>
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Tiến độ học tập
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi hành trình và các cột mốc học tập của bạn.
          </p>
        </div>

        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Target className="h-8 w-8" />
          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Chưa có mục tiêu học tập
          </h2>

          <p className="mt-2 max-w-md text-sm text-gray-500">
            Khi bạn có mục tiêu học tập, toàn bộ tiến độ và các cột mốc sẽ được hiển thị
            tại đây.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <TrendingUp className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Tiến độ học tập
            </h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Theo dõi hành trình học tập qua từng mục tiêu và cột mốc.
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-950/60 dark:bg-indigo-950/30">
          <div className="flex items-center justify-between">
            <Target className="h-5 w-5 text-indigo-600" />
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {goals.length}
            </span>
          </div>

          <p className="mt-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
            Tổng mục tiêu
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-950/60 dark:bg-emerald-950/30">
          <div className="flex items-center justify-between">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {completedGoals}
            </span>
          </div>

          <p className="mt-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
            Mục tiêu hoàn thành
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-4 dark:border-purple-950/60 dark:bg-purple-950/30">
          <div className="flex items-center justify-between">
            <Flag className="h-5 w-5 text-purple-600" />
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {totalCompletedMilestones}
            </span>
          </div>

          <p className="mt-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
            Mốc đã hoàn thành
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 dark:border-amber-950/60 dark:bg-amber-950/30">
          <div className="flex items-center justify-between">
            <BarChart3 className="h-5 w-5 text-amber-600" />
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {overallProgress}%
            </span>
          </div>

          <p className="mt-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
            Tiến độ tổng thể
          </p>
        </div>
      </div>

      {/* Goal selector */}
      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              Mục tiêu của bạn
            </p>

            <h2 className="mt-1 text-lg font-black text-gray-900 dark:text-white">
              Chọn mục tiêu để xem tiến độ
            </h2>
          </div>

          <BookOpen className="h-5 w-5 text-gray-400" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const goalMilestones = goal.milestones ?? []

            const completed = goalMilestones.filter(
              (milestone) => milestone.status === LearningStatus.Completed,
            ).length

            const percent =
              goalMilestones.length > 0
                ? Math.round((completed / goalMilestones.length) * 100)
                : 0

            const isSelected = selectedGoalId === goal.id

            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => setSelectedGoalId(goal.id)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/70 shadow-sm dark:border-indigo-500 dark:bg-indigo-950/30'
                    : 'border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-white dark:border-gray-800 dark:bg-gray-950/40 dark:hover:border-indigo-700 dark:hover:bg-gray-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-gray-900 dark:text-white">
                      {goal.title}
                    </h3>

                    {goal.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {goal.description}
                      </p>
                    )}
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-indigo-600" />
                  )}
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-[11px] font-semibold">
                    <span className="text-gray-500">Tiến độ</span>
                    <span className="text-indigo-600">{percent}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {selectedGoal && (
        <>
          {/* Selected goal summary */}
          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="p-6">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                      MỤC TIÊU ĐANG XEM
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                    {selectedGoal.title}
                  </h2>

                  {selectedGoal.description && (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                      {selectedGoal.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <div className="relative flex h-28 w-28 items-center justify-center">
                    <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="9"
                        className="text-gray-100 dark:text-gray-800"
                      />

                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="9"
                        strokeLinecap="round"
                        className="text-indigo-500"
                        strokeDasharray={`${progress * 2.64} 264`}
                      />
                    </svg>

                    <div className="absolute text-center">
                      <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {progress}%
                      </p>
                      <p className="text-[9px] font-semibold text-gray-400">HOÀN THÀNH</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-950/50">
                  <p className="text-xs text-gray-500">Tổng cột mốc</p>
                  <p className="mt-1 text-xl font-black text-gray-900 dark:text-white">
                    {milestones.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
                  <p className="text-xs text-gray-500">Đã hoàn thành</p>
                  <p className="mt-1 text-xl font-black text-emerald-600">
                    {completedMilestones}
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/30">
                  <p className="text-xs text-gray-500">Đang thực hiện</p>
                  <p className="mt-1 text-xl font-black text-amber-600">
                    {milestones.length - completedMilestones}
                  </p>
                </div>

                <div className="rounded-2xl bg-purple-50 p-4 dark:bg-purple-950/30">
                  <p className="text-xs text-gray-500">Mốc tiếp theo</p>
                  <p className="mt-1 truncate text-sm font-black text-purple-600">
                    {nextMilestone?.title ?? 'Đã hoàn thành 🎉'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Next milestone */}
          {nextMilestone && (
            <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-5 dark:border-indigo-950/60 dark:from-indigo-950/30 dark:to-purple-950/30">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm dark:bg-gray-900">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-bold tracking-wider text-indigo-500 uppercase">
                    Cột mốc tiếp theo
                  </p>

                  <h3 className="mt-1 text-base font-black text-gray-900 dark:text-white">
                    {nextMilestone.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Hạn mục tiêu: {formatDate(nextMilestone.targetDate)}
                  </p>

                  {getDaysRemaining(nextMilestone.targetDate) !== null && (
                    <p className="mt-2 text-xs font-bold text-indigo-600">
                      {getDaysRemaining(nextMilestone.targetDate)! >= 0
                        ? `Còn ${getDaysRemaining(nextMilestone.targetDate)} ngày`
                        : `Đã quá hạn ${Math.abs(
                            getDaysRemaining(nextMilestone.targetDate)!,
                          )} ngày`}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Timeline */}
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-black text-gray-900 dark:text-white">
                  Lộ trình mục tiêu
                </h2>
                <p className="text-xs text-gray-500">
                  Các cột mốc theo thứ tự hoàn thành
                </p>
              </div>
            </div>

            {milestones.length === 0 ? (
              <div className="rounded-2xl bg-gray-50 p-8 text-center dark:bg-gray-950/50">
                <Flag className="mx-auto h-8 w-8 text-gray-300" />

                <p className="mt-3 text-sm font-semibold text-gray-500">
                  Chưa có cột mốc nào cho mục tiêu này.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute top-3 bottom-3 left-[19px] w-px bg-gray-200 dark:bg-gray-800" />

                <div className="space-y-6">
                  {milestones.map((milestone, index) => {
                    const completed = milestone.status === LearningStatus.Completed
                    const daysRemaining = getDaysRemaining(milestone.targetDate)

                    return (
                      <div key={milestone.id} className="relative flex gap-4">
                        <div
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white dark:border-gray-900 ${
                            completed
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white text-gray-400 shadow-sm dark:bg-gray-900'
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </div>

                        <div
                          className={`min-w-0 flex-1 rounded-2xl border p-4 ${
                            completed
                              ? 'border-emerald-100 bg-emerald-50/50 dark:border-emerald-950/50 dark:bg-emerald-950/20'
                              : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/40'
                          }`}
                        >
                          <div className="flex flex-col justify-between gap-2 sm:flex-row">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-gray-400">
                                  #{index + 1}
                                </span>

                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                  {milestone.title}
                                </h3>
                              </div>

                              {milestone.description && (
                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                  {milestone.description}
                                </p>
                              )}
                            </div>

                            <div className="shrink-0 text-left sm:text-right">
                              <p className="flex items-center gap-1 text-xs font-semibold text-gray-500 sm:justify-end">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {formatDate(milestone.targetDate)}
                              </p>

                              {completed ? (
                                <span className="mt-1 inline-block text-[10px] font-bold text-emerald-600">
                                  ĐÃ HOÀN THÀNH
                                </span>
                              ) : daysRemaining !== null ? (
                                <span
                                  className={`mt-1 inline-block text-[10px] font-bold ${
                                    daysRemaining < 0 ? 'text-red-500' : 'text-amber-600'
                                  }`}
                                >
                                  {daysRemaining < 0
                                    ? `Quá hạn ${Math.abs(daysRemaining)} ngày`
                                    : `Còn ${daysRemaining} ngày`}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Achievement */}
          {progress === 100 && (
            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                  <Award className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-black text-gray-900 dark:text-white">
                    Mục tiêu đã hoàn thành! 🎉
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Bạn đã hoàn thành toàn bộ các cột mốc của mục tiêu này.
                  </p>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
