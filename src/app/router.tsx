import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { RoleBasedRoute } from '@/features/auth/RoleBasedRoute'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { UnauthorizedPage } from '@/pages/UnauthorizedPage'

// Lazy loading pages
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const LoginPage = lazy(() =>
  import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const StudentRegisterPage = lazy(() =>
  import('@/features/auth/StudentRegisterPage').then((m) => ({
    default: m.StudentRegisterPage,
  })),
)
const TutorRegisterPage = lazy(() =>
  import('@/features/auth/TutorRegisterPage').then((m) => ({
    default: m.TutorRegisterPage,
  })),
)
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/ForgotPasswordPage').then((m) => ({
    default: m.ForgotPasswordPage,
  })),
)
const ResetPasswordPage = lazy(() =>
  import('@/features/auth/ResetPasswordPage').then((m) => ({
    default: m.ResetPasswordPage,
  })),
)
const VerifyEmailPage = lazy(() =>
  import('@/features/auth/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })),
)
const AdminLayout = lazy(() =>
  import('@/features/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })),
)
const AdminDashboardPage = lazy(() =>
  import('@/features/admin/AdminDashboardPage').then((m) => ({
    default: m.AdminDashboardPage,
  })),
)
const TutorApplicationsPage = lazy(() =>
  import('@/features/admin/TutorApplicationsPage').then((m) => ({
    default: m.TutorApplicationsPage,
  })),
)
const SubjectsPage = lazy(() =>
  import('@/features/admin/SubjectsPage').then((m) => ({ default: m.SubjectsPage })),
)
const ComplaintsPage = lazy(() =>
  import('@/features/admin/ComplaintsPage').then((m) => ({ default: m.ComplaintsPage })),
)
const UsersManagementPage = lazy(() =>
  import('@/features/admin/UsersManagementPage').then((m) => ({
    default: m.UsersManagementPage,
  })),
)
const TutorProfilePage = lazy(() =>
  import('@/pages/TutorProfile').then((m) => ({ default: m.TutorProfilePage })),
)
const TutorTimetablePage = lazy(() =>
  import('@/pages/tutorTimetable').then((m) => ({ default: m.TutorTimetablePage })),
)

// student
const StudentLayout = lazy(() => import('@/components/layout/StudentLayout'))
const StudentDashboardPage = lazy(
  () => import('@/features/student/pages/StudentDashboardPage'),
)
const StudentSchedulePage = lazy(
  () => import('@/features/student/pages/StudentSchedulePage'),
)
const StudentFindTutorPage = lazy(
  () => import('@/features/student/pages/StudentFindTutorPage'),
)
const StudentProgressPage = lazy(
  () => import('@/features/student/pages/StudentProgressPage'),
)
const StudentProfilePage = lazy(
  () => import('@/features/student/pages/StudentProfilePage'),
)

const StudentScheduleDetailPage = lazy(
  () => import('@/features/student/pages/StudentScheduleDetailPage'),
)
const StudentTutorDetailPage = lazy(
  () => import('@/features/student/pages/StudentTutorDetailPage'),
)

export const router = createBrowserRouter([
  // Public Auth Routes
  { path: '/login', element: <LoginPage /> },
  { path: '/register/student', element: <StudentRegisterPage /> },
  { path: '/register/tutor', element: <TutorRegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },

  { path: '/', element: <HomePage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            element: <RoleBasedRoute allowedRoles={['tutor']} />,
            children: [
              { path: 'tutor/profile', element: <TutorProfilePage /> },
              { path: 'tutor/timetable', element: <TutorTimetablePage /> },
            ],
          },
          {
            element: <RoleBasedRoute allowedRoles={['admin']} />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  { path: 'admin/dashboard', element: <AdminDashboardPage /> },
                  {
                    path: 'admin/tutor-applications',
                    element: <TutorApplicationsPage />,
                  },
                  { path: 'admin/subjects', element: <SubjectsPage /> },
                  { path: 'admin/complaints', element: <ComplaintsPage /> },
                  { path: 'admin/users', element: <UsersManagementPage /> },
                ],
              },
            ],
          },
        ],
      },
      {
        element: <RoleBasedRoute allowedRoles={['student']} />,
        children: [
          {
            path: 'student',
            element: <StudentLayout />,
            children: [
              { index: true, element: <StudentDashboardPage /> }, // /student

              { path: 'dashboard', element: <StudentDashboardPage /> },

              { path: 'tutors', element: <StudentFindTutorPage /> },
              {
                path: 'tutors/tutorDetail/:tutorId',
                element: <StudentTutorDetailPage />,
              },

              { path: 'schedule', element: <StudentSchedulePage /> },
              {
                path: 'schedule/:scheduleId',
                element: <StudentScheduleDetailPage />,
              },
              { path: 'progress', element: <StudentProgressPage /> },

              { path: 'profile', element: <StudentProfilePage /> },
            ],
          },
        ],
      },
    ],
  },

  // 404 Fallback
  { path: '*', element: <NotFoundPage /> },
])
