import { useQuery } from '@tanstack/react-query'
import { Toaster, toast } from 'react-hot-toast'
import {
  ArrowLeft,
  Star,
  Award,
  BookOpen,
  Clock,
  ShieldCheck,
  CalendarCheck,
  GraduationCap,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import type { TutorDetail, TutorSubject } from '../types/tutor.types'
import { studentApi } from '../api/studentApi'

export default function StudentTutorDetailPage() {
  const { tutorId } = useParams<{ tutorId: string }>()
  const navigate = useNavigate()

  const numericTutorId = Number(tutorId)

  // Gọi API lấy thông tin chi tiết gia sư theo ID
  const {
    data: tutor,
    isLoading,
    isError,
    error,
  } = useQuery<TutorDetail>({
    queryKey: ['tutor-detail', numericTutorId],
    queryFn: () => studentApi.getTutorById(numericTutorId),
    enabled: !isNaN(numericTutorId) && numericTutorId > 0,
  })
  console.log('URL tutorId:', tutorId)
  console.log('numericTutorId:', numericTutorId)
  // URL Avatar đa dạng sinh ra từ userId và tên
  const avatarSeed = encodeURIComponent(
    `${tutor?.userId || numericTutorId}-${tutor?.fullName || 'tutor'}`,
  )
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        <p className="mt-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
          Đang tải thông tin chi tiết gia sư...
        </p>
      </div>
    )
  }

  if (isError || !tutor) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/40 dark:bg-red-950/20">
        <h3 className="text-sm font-bold text-red-600 dark:text-red-400">
          Không tìm thấy thông tin gia sư!
        </h3>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {(error as any)?.message || 'Gia sư không tồn tại hoặc có lỗi từ máy chủ.'}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Toaster position="top-right" />

      {/* Button Quay lại */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
        </button>
      </div>

      {/* Header Info Section */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5 sm:items-center">
            {/* Avatar */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl border-4 border-indigo-100 bg-indigo-50/50 p-1 shadow-inner sm:h-24 sm:w-24 dark:border-indigo-950 dark:bg-gray-800">
              <img
                src={avatarUrl}
                alt={tutor.fullName}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Thông tin tên & tổng quan */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black text-gray-900 sm:text-2xl dark:text-gray-100">
                  {tutor.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> Đã xác minh
                </span>
              </div>

              <p className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                <GraduationCap className="h-4 w-4 text-indigo-500" />
                {tutor.qualification}
              </p>

              {/* Stat Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span>
                    {tutor.averageRating ? tutor.averageRating.toFixed(1) : '5.0'}
                  </span>
                  <span className="font-normal text-gray-400">
                    ({tutor.reviewCount} đánh giá)
                  </span>
                </div>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <div className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                  <Clock className="h-3.5 w-3.5 text-indigo-500" />
                  <span>{tutor.experienceYears} năm kinh nghiệm</span>
                </div>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <div className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                  <Award className="h-3.5 w-3.5 text-purple-500" />
                  <span>
                    Điểm uy tín:{' '}
                    {tutor.reputationScore ? tutor.reputationScore.toFixed(1) : '5.0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cột Trái: Giới thiệu & Danh sách Môn giảng dạy */}
        <div className="space-y-6 lg:col-span-2">
          {/* Giới thiệu bản thân */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100">
              <BookOpen className="h-4 w-4 text-indigo-600" />
              Giới thiệu bản thân
            </h2>
            <p className="mt-3 text-xs leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-300">
              {tutor.bio || 'Chưa có thông tin giới thiệu chi tiết.'}
            </p>
          </div>

          {/* Danh sách các Môn giảng dạy */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100">
              <GraduationCap className="h-4 w-4 text-indigo-600" />
              Môn học đảm nhận
            </h2>

            {!tutor.subjects || tutor.subjects.length === 0 ? (
              <p className="mt-3 text-xs text-gray-400">
                Gia sư chưa đăng ký môn học nào.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {tutor.subjects
                  .filter((ts: TutorSubject) => ts.isActive)
                  .map((item: TutorSubject) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-gray-50/60 p-4 transition hover:border-indigo-200 dark:border-gray-800 dark:bg-gray-950/40"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded-lg bg-indigo-100 px-2.5 py-1 text-[10px] font-extrabold text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                            {item.subject.code}
                          </span>
                          <span className="rounded-lg bg-gray-200/70 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {item.teachingLevel}
                          </span>
                        </div>

                        <h3 className="mt-2 text-sm font-bold text-gray-900 dark:text-gray-100">
                          {item.subject.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-[11px] text-gray-500 dark:text-gray-400">
                          {item.subject.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-gray-200/50 pt-2.5 dark:border-gray-800">
                        <span className="text-[11px] text-gray-400">Học phí:</span>
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                          {item.feePerSessionCredits} Credits / buổi
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Cột Phải: Card Đặt lịch nhanh */}
        <div className="space-y-6">
          <div className="sticky top-6 rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50/40 to-white p-6 shadow-sm dark:border-indigo-950 dark:from-indigo-950/20 dark:to-gray-900">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              Đặt lịch học với gia sư
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Lựa chọn khung giờ và môn học phù hợp để bắt đầu học tập.
            </p>

            <div className="mt-6 space-y-3">
              <button
                onClick={() =>
                  toast.success(`Chuyển đến màn hình tạo lịch hẹn với ${tutor.fullName}`)
                }
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-indigo-500/25 active:scale-95"
              >
                <CalendarCheck className="h-4 w-4" />
                Đặt lịch hẹn ngay
              </button>
            </div>

            <div className="mt-6 space-y-2 border-t border-gray-100 pt-4 dark:border-gray-800">
              <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>Thanh toán an toàn qua số dư Credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
