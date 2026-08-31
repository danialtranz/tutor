import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import toast, { Toaster } from 'react-hot-toast'
import { Search } from 'lucide-react'
import { studentApi, type TutorSearchParams } from '../api/studentApi'
import { useNavigate } from 'react-router-dom'

export default function StudentFindTutorPage() {
  const navigate = useNavigate()
  const pad = (num: number) => String(num).padStart(2, '0')

  const toDateInputValue = (date: Date) => {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  }

  // Mốc thời gian khởi tạo mặc định: Ngày mai
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const defaultDateStr = toDateInputValue(tomorrow)
  const defaultStartTime = '18:00'
  const defaultEndTime = '20:00'

  // State cho Form Controls
  const [subjectId, setSubjectId] = useState<number>(0)
  const [teachingLevel, setTeachingLevel] = useState<string>('Primary School') // 💡 Default: Cấp 1

  const [lessonDate, setLessonDate] = useState<string>(defaultDateStr)
  const [startTime, setStartTime] = useState<string>(defaultStartTime)
  const [endTime, setEndTime] = useState<string>(defaultEndTime)

  // Hàm hỗ trợ tính toán ISO String từ Date + Time local
  const getUtcTimes = (dateStr: string, startStr: string, endStr: string) => {
    const startLocal = new Date(`${dateStr}T${startStr}`)
    const endLocal = new Date(`${dateStr}T${endStr}`)
    return {
      startTimeUtc: isNaN(startLocal.getTime()) ? '' : startLocal.toISOString(),
      endTimeUtc: isNaN(endLocal.getTime()) ? '' : endLocal.toISOString(),
    }
  }

  const initialUtc = getUtcTimes(defaultDateStr, defaultStartTime, defaultEndTime)
  // Hàm bổ trợ gom thông tin thời gian hiện tại từ Form
  const getBookingState = () => {
    const { startTimeUtc, endTimeUtc } = getUtcTimes(lessonDate, startTime, endTime)
    return {
      lessonDate,
      startTime,
      endTime,
      startTimeUtc,
      endTimeUtc,
      subjectId,
    }
  }

  // State SearchParams gửi cho React Query API
  const [searchParams, setSearchParams] = useState<TutorSearchParams>({
    subjectId: 0,
    teachingLevel: 'Primary School',
    startTimeUtc: initialUtc.startTimeUtc,
    endTimeUtc: initialUtc.endTimeUtc,
  })

  // Lấy danh sách Môn học
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: studentApi.getSubjects,
    select: (data: any) => {
      if (Array.isArray(data)) return data
      if (Array.isArray(data?.data)) return data.data
      if (Array.isArray(data?.items)) return data.items
      return []
    },
  })

  // 💡 Tự động set môn học đầu tiên làm mặc định khi danh sách môn được tải về
  useEffect(() => {
    if (subjects.length > 0 && subjectId === 0) {
      const firstSubjectId = Number(subjects[0].id)
      setSubjectId(firstSubjectId)
      setSearchParams((prev) => ({
        ...prev,
        subjectId: firstSubjectId,
      }))
    }
  }, [subjects, subjectId])

  // React Query gọi API lấy danh sách Gia sư
  const {
    data: tutors = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tutor-search', searchParams],
    queryFn: () => studentApi.searchTutors(searchParams),
    // 💡 SỬA TẠI ĐÂY: Kiểm tra safe navigation + ép kiểu Number an toàn
    enabled: Boolean(searchParams && Number(searchParams.subjectId) > 0),
  })

  // Xử lý Sự kiện Submit Form
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!lessonDate || !startTime || !endTime) {
      toast.error('Vui lòng chọn đầy đủ ngày và thời gian học!')
      return
    }

    const startLocal = new Date(`${lessonDate}T${startTime}`)
    const endLocal = new Date(`${lessonDate}T${endTime}`)
    const now = new Date()

    if (isNaN(startLocal.getTime()) || isNaN(endLocal.getTime())) {
      toast.error('Ngày hoặc thời gian không hợp lệ!')
      return
    }

    if (startLocal <= now) {
      toast.error('Thời gian bắt đầu phải ở trong tương lai!')
      return
    }

    if (endLocal <= startLocal) {
      toast.error('Giờ kết thúc phải sau giờ bắt đầu!')
      return
    }

    const startTimeUtc = startLocal.toISOString()
    const endTimeUtc = endLocal.toISOString()

    setSearchParams({
      subjectId: Number(subjectId),
      teachingLevel: teachingLevel.trim(),
      startTimeUtc,
      endTimeUtc,
    })

    toast.success('Đang tìm kiếm gia sư...')
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
          Tìm kiếm Gia sư
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Lọc gia sư theo môn học, cấp độ và thời gian rảnh.
        </p>
      </div>

      {/* Form Filter */}
      <form
        onSubmit={handleSearch}
        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Select Môn */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Môn học
            </label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
              value={subjectId}
              onChange={(e) => setSubjectId(Number(e.target.value))}
            >
              {Array.isArray(subjects) &&
                subjects.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Select Cấp độ */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Cấp độ
            </label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
              value={teachingLevel}
              onChange={(e) => setTeachingLevel(e.target.value)}
            >
              <option value="Primary School">Tiểu học (Cấp 1)</option>
              <option value="Middle School">THCS (Cấp 2)</option>
              <option value="High School">THPT (Cấp 3)</option>
              <option value="University">Đại học</option>
              <option value="IELTS">IELTS</option>
            </select>
          </div>

          {/* Ngày học */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Ngày học
            </label>
            <input
              type="date"
              value={lessonDate}
              min={toDateInputValue(new Date())}
              onChange={(e) => setLessonDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            />
          </div>

          {/* Giờ bắt đầu */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Giờ bắt đầu
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            />
          </div>

          {/* Giờ kết thúc */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Giờ kết thúc
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Nút Tìm kiếm */}
        <div className="mt-4 flex justify-end border-t border-gray-100 pt-3 dark:border-gray-800">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Search className="h-4 w-4" />
            Tìm gia sư
          </button>
        </div>
      </form>

      {/* Hiển thị Danh Sách Gia Sư */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
            Đang tìm kiếm gia sư phù hợp...
          </p>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          Lỗi khi tải dữ liệu từ Server: {(error as any)?.message || 'Lỗi không xác định'}
        </div>
      ) : tutors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-800">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Không tìm thấy gia sư nào phù hợp
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Thử thay đổi môn học, cấp độ hoặc khung thời gian để xem thêm kết quả.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutors.map((item: any, index: number) => {
            const avatarSeed = encodeURIComponent(
              `${item.tutorId}-${item.fullName || 'tutor'}`,
            )
            const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`

            return (
              <div
                key={`${item.tutorId}-${item.subjectId}-${index}`}
                onClick={() =>
                  navigate(`tutorDetail/${item.tutorId}`, {
                    state: getBookingState(),
                  })
                }
                className="group relative flex cursor-pointer flex-col justify-between rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-900/60"
              >
                <div>
                  {/* Header Card: Avatar + Tên + Badge Môn */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 p-0.5 shadow-inner dark:border-indigo-950 dark:bg-gray-800">
                      <img
                        src={avatarUrl}
                        alt={item.fullName}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-extrabold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                          {item.subjectName || 'Môn học'}
                        </span>
                        <span className="shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {item.teachingLevel || 'Cấp 1'}
                        </span>
                      </div>

                      <h3 className="mt-1.5 truncate text-sm font-black text-gray-900 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
                        {item.fullName}
                      </h3>

                      {/* Rating & Lượt đánh giá */}
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                        <span className="flex items-center font-bold text-amber-500">
                          ★ {item.averageRating ? item.averageRating.toFixed(1) : '5.0'}
                        </span>
                        <span>•</span>
                        <span>{item.reviewCount || 0} đánh giá</span>
                      </div>
                    </div>
                  </div>

                  {/* Phần Bio ngắn */}
                  <p className="mt-3.5 line-clamp-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    {item.bio || 'Chưa có thông tin mô tả bản thân.'}
                  </p>

                  {/* Thông tin Bằng cấp & Kinh nghiệm */}
                  <div className="mt-3.5 space-y-1.5 rounded-2xl bg-gray-50/80 p-3 text-xs dark:bg-gray-950/50">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        🎓 Bằng cấp:
                      </span>
                      <span className="max-w-[150px] truncate font-semibold text-gray-800 dark:text-gray-200">
                        {item.qualification || 'Cử nhân'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        ⏳ Kinh nghiệm:
                      </span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {item.experienceYears} năm
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Card: Học phí & Button */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800/80">
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      Học phí / Buổi
                    </span>
                    <p className="text-base font-black text-indigo-600 dark:text-indigo-400">
                      {item.feePerSessionCredits}{' '}
                      <span className="text-xs font-bold">Credits</span>
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`tutorDetail/${item.tutorId}`, {
                        state: getBookingState(),
                      })
                    }}
                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-500/20 active:scale-95"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
