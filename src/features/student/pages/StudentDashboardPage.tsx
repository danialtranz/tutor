import { useQuery } from '@tanstack/react-query'
import { studentApi } from '@/features/student/api/studentApi'
import WelcomeCard from '../components/dashboard/WelcomeCard'
import UpcomingBookingCard from '../components/dashboard/UpcomingBookingCard'
import StatisticsCard from '../components/dashboard/StatisticsCard'
import QuickActions from '../components/dashboard/QuickActions'
import RecentActivitiesCard from '../components/dashboard/RecentActivitiesCard'
import NotificationsCard from '../components/dashboard/NotificationsCard'
import RecommendedTutorsCard from '../components/dashboard/RecommendedTutorsCard'
import LearningProgressCard from '../components/dashboard/LearningProgressCard'
import { useCurrentUser } from '../hooks/useCurrentUser'
import type { Booking } from '../types/booking.types'
import type { TutorSearchResult } from '../types/tutor.types'

export default function StudentDashboardPage() {
  // 1. User information
  const { data: currentUser, isLoading: isLoadingUser, error } = useCurrentUser()

  // 2. Fetch Bookings (Lấy thêm isLoadingBookings)
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery<Booking[]>({
    queryKey: ['my-bookings'],
    queryFn: () => studentApi.getBookings(),
    select: (data: any) => {
      if (Array.isArray(data)) return data
      if (Array.isArray(data?.data)) return data.data
      if (Array.isArray(data?.data?.data)) return data.data.data
      return []
    },
  })

  // 3. Fetch Recommended Tutors
  const { data: tutors = [], isLoading: isLoadingTutors } = useQuery<TutorSearchResult[]>(
    {
      queryKey: ['recommended-tutors'],
      queryFn: () => studentApi.searchTutors({}),
      select: (data: any) => {
        if (Array.isArray(data)) return data
        if (Array.isArray(data?.data)) return data.data
        if (Array.isArray(data?.items)) return data.items
        if (Array.isArray(data?.data?.items)) return data.data.items
        return []
      },
    },
  )

  // 4. Learning Goals
  const goals: any[] = []

  // Lọc danh sách buổi học sắp diễn ra
  const confirmedBookings = bookings
    .filter((b) => {
      const isConfirmed =
        b.status === 'Confirmed' || (b.status as any) === 2 || (b.status as any) === '2'
      const isUpcoming = new Date(b.startTimeUtc).getTime() >= Date.now()
      return isConfirmed && isUpcoming
    })
    .sort(
      (a, b) => new Date(a.startTimeUtc).getTime() - new Date(b.startTimeUtc).getTime(),
    )

  const nextBooking = confirmedBookings[0]

  const completedSessions = bookings.filter(
    (b) =>
      b.status === 'Completed' || (b.status as any) === 5 || (b.status as any) === '5',
  ).length

  const todaySessionsCount = confirmedBookings.filter((b) => {
    const today = new Date().toDateString()
    return new Date(b.startTimeUtc).toDateString() === today
  }).length

  if (isLoadingUser) {
    return (
      <div className="p-6 text-center text-sm font-medium text-gray-500">
        Đang tải thông tin...
      </div>
    )
  }

  if (error || !currentUser) {
    return (
      <div className="p-6 text-center text-sm font-medium text-red-500">
        Không lấy được thông tin người dùng
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      <WelcomeCard user={currentUser} todaySessionsCount={todaySessionsCount} />

      {/* Truyền isLoadingBookings thực tế vào đây */}
      <UpcomingBookingCard nextBooking={nextBooking} isLoading={isLoadingBookings} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <LearningProgressCard goals={goals} />
        <StatisticsCard completedSessions={completedSessions} />
      </div>

      <QuickActions />

      {/* RecommendedTutorsCard nhận danh sách tutors */}
      <RecommendedTutorsCard tutors={tutors} />
    </div>
  )
}
