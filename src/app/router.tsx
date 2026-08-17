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
const UsersListPage = lazy(() =>
  import('@/features/users/UsersListPage').then((m) => ({ default: m.UsersListPage })),
)
const LoginPage = lazy(() =>
  import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const StudentRegisterPage = lazy(() =>
  import('@/features/auth/StudentRegisterPage').then((m) => ({ default: m.StudentRegisterPage })),
)
const TutorRegisterPage = lazy(() =>
  import('@/features/auth/TutorRegisterPage').then((m) => ({ default: m.TutorRegisterPage })),
)
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
)
const ResetPasswordPage = lazy(() =>
  import('@/features/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
)
const AdminLayout = lazy(() =>
  import('@/features/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })),
)
const AdminDashboardPage = lazy(() =>
  import('@/features/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
)
const TutorApplicationsPage = lazy(() =>
  import('@/features/admin/TutorApplicationsPage').then((m) => ({ default: m.TutorApplicationsPage })),
)
const SubjectsPage = lazy(() =>
  import('@/features/admin/SubjectsPage').then((m) => ({ default: m.SubjectsPage })),
)
const ComplaintsPage = lazy(() =>
  import('@/features/admin/ComplaintsPage').then((m) => ({ default: m.ComplaintsPage })),
)
const UsersManagementPage = lazy(() =>
  import('@/features/admin/UsersManagementPage').then((m) => ({ default: m.UsersManagementPage })),
)

export const router = createBrowserRouter([
  // Public Auth Routes
  { path: '/login', element: <LoginPage /> },
  { path: '/register/student', element: <StudentRegisterPage /> },
  { path: '/register/tutor', element: <TutorRegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },

  { path: '/', element: <HomePage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: 'users', element: <UsersListPage /> },
          {
            element: <RoleBasedRoute allowedRoles={['admin']} />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  { path: 'admin/dashboard', element: <AdminDashboardPage /> },
                  { path: 'admin/tutor-applications', element: <TutorApplicationsPage /> },
                  { path: 'admin/subjects', element: <SubjectsPage /> },
                  { path: 'admin/complaints', element: <ComplaintsPage /> },
                  { path: 'admin/users', element: <UsersManagementPage /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 404 Fallback
  { path: '*', element: <NotFoundPage /> },
])
