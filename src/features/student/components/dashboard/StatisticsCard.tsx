import { Award, Star } from 'lucide-react'

interface StatisticsCardProps {
  completedSessions: number
}

export function StatisticsCard({ completedSessions }: StatisticsCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Thống kê cá nhân
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tổng quan kết quả học tập
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 dark:border-indigo-950/60 dark:bg-indigo-950/30">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Buổi học hoàn thành
            </span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {completedSessions}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50/50 p-3.5 dark:border-purple-950/60 dark:bg-purple-950/30">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Mục tiêu đang thực hiện
            </span>
            <span className="text-lg font-black text-purple-600 dark:text-purple-400">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/50 p-3.5 dark:border-amber-950/60 dark:bg-amber-950/30">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Đánh giá trung bình
            </span>
            <span className="flex items-center gap-1 text-lg font-black text-amber-600 dark:text-amber-400">
              4.8 <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsCard
