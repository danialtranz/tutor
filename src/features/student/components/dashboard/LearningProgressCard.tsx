import { useMemo, useState } from 'react'
import { BookOpen, ChevronDown, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { LearningGoal } from '../../types/learningGoal.types'
import { LearningStatus } from '@/constants/enums'

interface LearningProgressCardProps {
  goals: LearningGoal[]
}

interface ChartPoint {
  date: string
  displayDate: string
  progress: number
  milestone: string
  status: number
}

export function LearningProgressCard({ goals }: LearningProgressCardProps) {
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(
    goals[0]?.id ?? null,
  )

  const selectedGoal = useMemo(
    () => goals.find((goal) => goal.id === selectedGoalId) ?? goals[0],
    [goals, selectedGoalId],
  )

  /**
   * Tạo dữ liệu cho line chart từ milestones.
   *
   * Vì BE hiện tại chưa có progressHistory,
   * nên progress được suy ra từ số milestone đã hoàn thành.
   */
  const chartData = useMemo<ChartPoint[]>(() => {
    if (!selectedGoal) return []

    const milestones = [...(selectedGoal.milestones ?? [])].sort(
      (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime(),
    )

    if (milestones.length === 0) {
      return [
        {
          date: selectedGoal.targetDate,
          displayDate: formatDate(selectedGoal.targetDate),
          progress: selectedGoal.currentProgressPercent,
          milestone: 'Tiến độ hiện tại',
          status: selectedGoal.status,
        },
      ]
    }

    const total = milestones.length

    const points = milestones.map((milestone, index) => {
      const completedCount = milestones.filter(
        (item) =>
          item.status === LearningStatus.Completed &&
          item.orderNumber <= milestone.orderNumber,
      ).length

      const milestoneProgress = Math.round((completedCount / total) * 100)

      return {
        date: milestone.targetDate,
        displayDate: formatDate(milestone.targetDate),
        progress: milestoneProgress,
        milestone: milestone.title,
        status: milestone.status,
      }
    })

    // Thêm điểm hiện tại vào cuối chart
    const lastPoint = points[points.length - 1]!

    const lastDate = new Date(lastPoint.date).getTime()
    const currentDate = new Date().getTime()

    if (currentDate >= lastDate) {
      points.push({
        date: new Date().toISOString(),
        displayDate: 'Hiện tại',
        progress: selectedGoal.currentProgressPercent,
        milestone: 'Tiến độ hiện tại',
        status: selectedGoal.status,
      })
    }

    return points
  }, [selectedGoal])

  if (goals.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex items-center gap-3">
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

        <p className="py-8 text-center text-xs text-gray-500 italic dark:text-gray-400">
          Chưa có mục tiêu học tập nào được đặt.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
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
              Theo dõi tiến độ qua từng cột mốc
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

      {/* Goal selector */}
      <div className="mb-5">
        <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400">
          Mục tiêu
        </label>

        <div className="relative">
          <select
            value={selectedGoal?.id ?? ''}
            onChange={(e) => {
              setSelectedGoalId(Number(e.target.value))
            }}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-gray-800 transition outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {selectedGoal && (
        <>
          {/* Current progress */}
          <div className="mb-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {selectedGoal.title}
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {selectedGoal.subject.name}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <TrendingUp className="h-4 w-4" />

                <span className="text-lg font-bold">
                  {selectedGoal.currentProgressPercent}%
                </span>
              </div>
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    Math.max(selectedGoal.currentProgressPercent, 0),
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Line chart */}
          <div className="mb-5">
            <div className="mb-3">
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                Biểu đồ tiến độ
              </h4>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tiến độ được tính dựa trên các cột mốc của mục tiêu
              </p>
            </div>

            {chartData.length > 0 ? (
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -15,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    <XAxis
                      dataKey="displayDate"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null

                        const point = payload[0]?.payload as ChartPoint

                        return (
                          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                              {point.displayDate}
                            </p>

                            <p className="mt-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                              {point.progress}% tiến độ
                            </p>

                            <p className="mt-1 max-w-[180px] text-xs text-gray-600 dark:text-gray-300">
                              {point.milestone}
                            </p>
                          </div>
                        )
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="progress"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                      }}
                      activeDot={{
                        r: 7,
                      }}
                      isAnimationActive
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-8 text-center text-xs text-gray-500">
                Chưa có dữ liệu tiến độ.
              </p>
            )}
          </div>

          {/* Milestone list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                Các cột mốc
              </h4>

              <span className="text-xs text-gray-400">
                {selectedGoal.milestones?.length ?? 0} mốc
              </span>
            </div>

            {selectedGoal.milestones?.map((milestone) => {
              const isCompleted = milestone.status === LearningStatus.Completed

              return (
                <div
                  key={milestone.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 dark:border-gray-800"
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isCompleted
                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {milestone.orderNumber}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-semibold ${
                        isCompleted
                          ? 'text-gray-400 line-through'
                          : 'text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {milestone.title}
                    </p>

                    <p className="mt-0.5 text-[11px] text-gray-400">
                      Hạn: {formatDate(milestone.targetDate)}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-bold ${
                      isCompleted
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {isCompleted ? 'Hoàn thành' : 'Đang học'}
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  })
}

export default LearningProgressCard
