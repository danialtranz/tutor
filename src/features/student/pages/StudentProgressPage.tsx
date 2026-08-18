import { useQuery } from '@tanstack/react-query'
import { studentApi } from '@/features/student/api/studentApi'
import { Target, CheckCircle2, Circle, BookOpen } from 'lucide-react'
import type { LearningGoal } from '../types/learningGoal.types'

export default function StudentProgressPage() {
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['learning-goals'],
    queryFn: () => studentApi.getLearningGoals(),
    select: (data) => data?.items ?? [],
  })

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
          Tiến độ & Mục tiêu Học tập
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Theo dõi phần trăm hoàn thành chỉ tiêu học tập và các mốc kiến thức
          (Milestones).
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
          Đang tải mục tiêu...
        </div>
      ) : goals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          Bạn chưa có mục tiêu học tập nào được tạo.
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal: LearningGoal) => {
            const clampedProgress = Math.min(
              100,
              Math.max(0, goal.currentProgressPercent || 0),
            )

            return (
              <div
                key={goal.id}
                className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                      <BookOpen className="h-3 w-3" />
                      {goal.subject?.name || 'Môn học'}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-gray-900 dark:text-gray-100">
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                        {goal.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                      {clampedProgress}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out dark:bg-indigo-500"
                    style={{ width: `${clampedProgress}%` }}
                  />
                </div>

                {/* Milestones */}
                {goal.milestones && goal.milestones.length > 0 && (
                  <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800/80">
                    <p className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
                      <Target className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      Các mốc học tập (Milestones)
                    </p>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {goal.milestones.map((m) => {
                        const isCompleted = m.status === 'Completed'
                        return (
                          <div
                            key={m.id}
                            className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-xs dark:border-gray-800 dark:bg-gray-950"
                          >
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {m.title}
                            </span>
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Hoàn thành
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-semibold text-gray-400">
                                <Circle className="h-3.5 w-3.5" /> Chưa xong
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
