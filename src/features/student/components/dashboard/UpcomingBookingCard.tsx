import { Calendar, Clock, Search, Video } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Booking } from '../../types/booking.types'

interface UpcomingBookingCardProps {
  nextBooking?: Booking
  isLoading: boolean
}

export default function UpcomingBookingCard({
  nextBooking,
  isLoading,
}: UpcomingBookingCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Buổi học sắp tới
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Lịch học tiếp theo trong hệ thống
            </p>
          </div>
        </div>

        <Link
          to="/student/schedule"
          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60"
        >
          Xem tất cả
        </Link>
      </div>

      {isLoading ? (
        <p className="py-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Đang tải lịch học...
        </p>
      ) : nextBooking ? (
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 sm:flex-row sm:items-center dark:border-indigo-950/80 dark:bg-indigo-950/30">
          <div className="flex items-center gap-4">
            <img
              src={'https://api.dicebear.com/7.x/avataaars/svg?seed=tutor'}
              alt="Avatar Gia sư"
              className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm dark:border-gray-800"
            />
            <div>
              <span className="mb-1 inline-block rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Sắp diễn ra
              </span>
              <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                {nextBooking.status}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Gia sư:{' '}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {nextBooking.creditCost}
                </span>
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(nextBooking.startTimeUtc).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>

          {nextBooking.meetingUrl ? (
            <a
              href={nextBooking.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-center text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto"
            >
              <Video className="h-4 w-4" /> Vào phòng học (Google Meet)
            </a>
          ) : (
            <span className="text-xs text-gray-400 italic dark:text-gray-500">
              Chưa có link lớp
            </span>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-8 text-center dark:border-gray-800 dark:bg-gray-800/20">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Bạn chưa có buổi học nào sắp diễn ra.
          </p>
          <Link
            to="/student/tutors"
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Search className="h-3.5 w-3.5" /> Tìm gia sư đặt lịch ngay
          </Link>
        </div>
      )}
    </div>
  )
}
