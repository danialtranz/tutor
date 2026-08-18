import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import toast, { Toaster } from 'react-hot-toast'
import { Search } from 'lucide-react'
import { studentApi, type TutorSearchParams } from '../api/studentApi'

// Helper format datetime-local input
const toLocalInputValue = (date: Date) => {
  const pad = (num: number) => String(num).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function StudentFindTutorPage() {
  // 1. Mốc thời gian mặc định: Ngày mai -> 1 tháng sau
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const nextMonth = new Date(tomorrow)
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  // 2. State local của Form
  const [subjectId, setSubjectId] = useState<number>(3)
  const [teachingLevel, setTeachingLevel] = useState<string>('UpperSecondary')
  const [startTime, setStartTime] = useState<string>(toLocalInputValue(tomorrow))
  const [endTime, setEndTime] = useState<string>(toLocalInputValue(nextMonth))

  // 3. State trigger gọi API (Starter mặc định từ ngày mai -> tháng sau)
  const [searchParams, setSearchParams] = useState<TutorSearchParams>({
    subjectId: 3,
    teachingLevel: 'UpperSecondary',
    startTimeUtc: tomorrow.toISOString(),
    endTimeUtc: nextMonth.toISOString(),
  })

  // 4. React Query gọi API lấy danh sách Gia sư
  const {
    data: tutors = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tutor-search', searchParams],
    queryFn: () => studentApi.searchTutors(searchParams),
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

  // 5. Bắt lỗi & Bật TOAST cảnh báo trước khi gọi API
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // --- BẮT LỖI 1: Thiếu/Sai Môn học ---
    if (!subjectId || Number(subjectId) <= 0) {
      toast.error('Vui lòng chọn một môn học hợp lệ!')
      return
    }

    // --- BẮT LỖI 2: Thiếu Cấp độ ---
    if (!teachingLevel) {
      toast.error('Vui lòng chọn cấp độ dạy học!')
      return
    }

    // --- BẮT LỖI 3: Chọn dở dang ô thời gian ---
    if ((startTime && !endTime) || (!startTime && endTime)) {
      toast.error('Vui lòng chọn đầy đủ cả thời gian Bắt đầu và Kết thúc!')
      return
    }

    // --- BẮT LỖI 4: Logic thời gian ---
    if (startTime && endTime) {
      const startMs = new Date(startTime).getTime()
      const endMs = new Date(endTime).getTime()
      const nowMs = new Date().getTime()

      if (isNaN(startMs) || isNaN(endMs)) {
        toast.error('Thời gian chọn không hợp lệ, vui lòng chọn lại!')
        return
      }

      if (startMs < nowMs - 60000) {
        toast.error('Thời gian bắt đầu không thể ở trong quá khứ!')
        return
      }

      if (endMs <= startMs) {
        toast.error('Thời gian kết thúc phải lớn hơn (sau) thời gian bắt đầu!')
        return
      }
    }

    // Đủ điều kiện -> Cập nhật state searchParams để React Query tự kích hoạt API
    const toUtcIso = (dateStr: string) =>
      dateStr ? new Date(dateStr).toISOString() : undefined

    setSearchParams({
      subjectId: Number(subjectId),
      teachingLevel: teachingLevel,
      startTimeUtc: toUtcIso(startTime),
      endTimeUtc: toUtcIso(endTime),
    })

    toast.success('Đang tìm kiếm gia sư...')
  }

  return (
    <div className="space-y-6">
      {/* Thêm Toaster để Toast có thể hiển thị ra màn hình */}
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              {Array.isArray(subjects) && subjects.length > 0 ? (
                subjects.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))
              ) : (
                <option value="1">Môn học 1</option>
              )}
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
              <option value="PrimarySchool">Tiểu học (Cấp 1)</option>
              <option value="MiddleSchool">THCS (Cấp 2)</option>
              <option value="UpperSecondary">THPT (Cấp 3)</option>
              <option value="University">Đại học</option>
            </select>
          </div>

          {/* Từ thời gian */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Từ thời gian
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            />
          </div>

          {/* Đến thời gian */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Đến thời gian
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
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
        <div className="p-12 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
          Đang tìm kiếm gia sư...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          Lỗi khi tải dữ liệu từ Server: {(error as any)?.message || 'Lỗi không xác định'}
        </div>
      ) : tutors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          Không tìm thấy gia sư nào phù hợp với tiêu chí lọc.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card tutor map qua mảng tutors giữ nguyên như cũ... */}
        </div>
      )}
    </div>
  )
}
