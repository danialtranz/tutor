import React from 'react'
import { Plus, Trash2, CheckCircle2, Circle, Loader2 } from 'lucide-react'

import type {
  LearningGoal,
  Milestone,
  CreateLearningGoalRequest,
  CreateMilestoneRequest,
} from '../../types/learningGoal.types'
import { LearningStatus } from '@/constants/enums'

interface LearningProgressTabProps {
  // Goals
  goals: LearningGoal[]
  bookingGoals: LearningGoal[]
  selectedGoal: LearningGoal | null
  loadingGoals: boolean

  // Goal form
  goalForm: CreateLearningGoalRequest
  setGoalForm: React.Dispatch<React.SetStateAction<CreateLearningGoalRequest>>

  // Milestone form
  milestoneForm: CreateMilestoneRequest
  setMilestoneForm: React.Dispatch<React.SetStateAction<CreateMilestoneRequest>>

  // Loading / submitting
  submittingGoal: boolean
  submittingMilestone: boolean

  // Handlers
  handleCreateGoal: (e: React.FormEvent) => void
  handleSelectGoal: (id: number) => void
  handleCreateMilestone: (e: React.FormEvent) => void
  handleToggleMilestoneStatus: (milestone: Milestone) => void
  handleDeleteMilestone: (id: number) => void

  // Utils
  calculateProgress: (milestones?: Milestone[]) => number
  formatDisplayDate: (date?: string) => string
}

export default function LearningProgressTab({
  goals,
  bookingGoals,
  selectedGoal,
  loadingGoals,
  goalForm,
  setGoalForm,
  milestoneForm,
  setMilestoneForm,
  submittingGoal,
  submittingMilestone,
  handleCreateGoal,
  handleSelectGoal,
  handleCreateMilestone,
  handleToggleMilestoneStatus,
  handleDeleteMilestone,
  calculateProgress,
  formatDisplayDate,
}: LearningProgressTabProps) {
  return (
    <div className="mt-5 space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Cột trái: Tạo & Chọn Goal */}
        <div className="space-y-4 lg:col-span-5">
          {/* Form tạo Goal */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-950/40">
            <h4 className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-gray-100">
              <Plus className="h-4 w-4 text-indigo-500" /> Tạo Mục Tiêu Mới
            </h4>
            <form onSubmit={handleCreateGoal} className="mt-3 space-y-2.5">
              <input
                type="text"
                placeholder="Tên mục tiêu..."
                className="w-full rounded-lg border border-gray-200 bg-white p-2 text-xs text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
                value={goalForm.title}
                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                required
              />
              <textarea
                rows={2}
                placeholder="Mô tả..."
                className="w-full rounded-lg border border-gray-200 bg-white p-2 text-xs text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
                value={goalForm.description}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, description: e.target.value })
                }
              />
              <input
                type="date"
                className="w-full rounded-lg border border-gray-200 bg-white p-2 text-xs text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
                value={goalForm.targetDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
              />
              <button
                type="submit"
                disabled={submittingGoal}
                className="w-full rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {submittingGoal ? (
                  <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" />
                ) : (
                  'Thêm Mục Tiêu'
                )}
              </button>
            </form>
          </div>

          {/* Danh sách Goals */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase">
              Danh sách mục tiêu ({bookingGoals.length})
            </span>

            {loadingGoals && goals.length === 0 ? (
              <p className="text-xs text-gray-400">Đang tải...</p>
            ) : bookingGoals.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400 dark:border-gray-800">
                Chưa có mục tiêu cho môn học của buổi này.
              </p>
            ) : (
              bookingGoals.map((goal) => {
                const isSelected = selectedGoal?.id === goal.id
                const progress = calculateProgress(goal.milestones)

                return (
                  <div
                    key={goal.id}
                    onClick={() => handleSelectGoal(goal.id)}
                    className={`cursor-pointer rounded-xl border p-3 transition ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/30 dark:border-indigo-500 dark:bg-indigo-950/20'
                        : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
                    }`}
                  >
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-900 dark:text-gray-100">
                        {goal.title}
                      </span>

                      <span className="text-indigo-600 dark:text-indigo-400">
                        {progress}%
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Cột phải: Chi tiết Goal & Cột mốc */}
        <div className="space-y-4 lg:col-span-7">
          {selectedGoal ? (
            <>
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-950/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {selectedGoal.title}
                  </h3>
                  <span className="text-xs font-bold text-indigo-600">
                    {calculateProgress(selectedGoal.milestones)}% hoàn thành
                  </span>
                </div>
                {selectedGoal.description && (
                  <p className="mt-1 text-xs text-gray-500">{selectedGoal.description}</p>
                )}
              </div>

              {/* Form thêm Milestone */}
              <form onSubmit={handleCreateMilestone} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tên cột mốc..."
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                  value={milestoneForm.title}
                  onChange={(e) =>
                    setMilestoneForm({
                      ...milestoneForm,
                      title: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="date"
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                  value={milestoneForm.targetDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setMilestoneForm({
                      ...milestoneForm,
                      targetDate: e.target.value,
                    })
                  }
                />
                <button
                  type="submit"
                  disabled={submittingMilestone}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  + Thêm
                </button>
              </form>

              {/* Danh sách Milestone */}
              <div className="space-y-2">
                {selectedGoal.milestones?.map((m) => {
                  const isDone = m.status === LearningStatus.Completed
                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => handleToggleMilestoneStatus(m)}
                          className="text-indigo-600"
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-300" />
                          )}
                        </button>
                        <span
                          className={`text-xs font-medium ${
                            isDone
                              ? 'text-gray-400 line-through'
                              : 'text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {m.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-gray-400">
                          {formatDisplayDate(m.targetDate)}
                        </span>
                        <button
                          onClick={() => handleDeleteMilestone(m.id)}
                          className="text-gray-400 hover:text-rose-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-xs text-gray-400">
              Chọn một mục tiêu bên trái để quản lý cột mốc.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
