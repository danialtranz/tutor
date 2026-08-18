import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LearningGoal } from '../../types/learningGoal.types'

interface LearningProgressCardProps {
  goals: LearningGoal[]
}

export function LearningProgressCard({ goals }: LearningProgressCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Tiến độ mục tiêu học tập
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Các mục tiêu bạn đang hoàn thành
            </p>
          </div>
        </div>
        <Link
          to="/student/progress"
          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60"
        >
          Chi tiết
        </Link>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-800 dark:text-gray-200">
                {goal.title}{' '}
                <span className="font-normal text-gray-400">({goal.subject.name})</span>
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {goal.currentProgressPercent}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${goal.currentProgressPercent}%` }}
              />
            </div>
          </div>
        ))}

        {goals.length === 0 && (
          <p className="py-4 text-center text-xs text-gray-500 italic dark:text-gray-400">
            Chưa có mục tiêu học tập nào được đặt.
          </p>
        )}
      </div>
    </div>
  )
}

export default LearningProgressCard
