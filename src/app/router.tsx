import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { RoleBasedRoute } from '@/features/auth/RoleBasedRoute'
import { AdminLayout } from '@/features/admin/AdminLayout'
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
const RegisterStudentPage = lazy(() =>
  import('@/features/auth/RegisterStudentPage').then((m) => ({ default: m.RegisterStudentPage })),
)
const RegisterTutorPage = lazy(() =>
  import('@/features/auth/RegisterTutorPage').then((m) => ({ default: m.RegisterTutorPage })),
)

// Admin Pages
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

export const router = createBrowserRouter([
  // Public Auth Routes
  { path: '/login', element: <LoginPage /> },
  { path: '/register/student', element: <RegisterStudentPage /> },
  { path: '/register/tutor', element: <RegisterTutorPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },

  // Protected App Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'users', element: <UsersListPage /> },

          // Admin Portal Routes (Role-based: admin only)
          {
            path: 'admin',
            element: <RoleBasedRoute allowedRoles={['admin']} />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  { path: 'dashboard', element: <AdminDashboardPage /> },
                  { path: 'tutor-applications', element: <TutorApplicationsPage /> },
                  { path: 'subjects', element: <SubjectsPage /> },
                  { path: 'complaints', element: <ComplaintsPage /> },
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
