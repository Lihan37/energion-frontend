import { createBrowserRouter } from 'react-router-dom'

import { ProtectedAdminRoute } from '../components/auth/ProtectedAdminRoute'
import { MainLayout } from '../layouts/MainLayout'
import { AdminLayout } from '../layouts/AdminLayout'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminIndexRedirect } from '../pages/admin/AdminIndexRedirect'
import { AdminProductsPage } from '../pages/admin/AdminProductsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('../pages/HomePage')).HomePage,
        }),
      },
      {
        path: 'products',
        lazy: async () => ({
          Component: (await import('../pages/ProductsPage')).ProductsPage,
        }),
      },
      {
        path: 'blog',
        lazy: async () => ({
          Component: (await import('../pages/BlogPage')).BlogPage,
        }),
      },
      {
        path: 'blog/:slug',
        lazy: async () => ({
          Component: (await import('../pages/BlogDetailsPage')).BlogDetailsPage,
        }),
      },
      {
        path: 'about',
        lazy: async () => ({
          Component: (await import('../pages/AboutPage')).AboutPage,
        }),
      },
      {
        path: 'contact',
        lazy: async () => ({
          Component: (await import('../pages/ContactPage')).ContactPage,
        }),
      },
      {
        path: 'map',
        lazy: async () => ({
          Component: (await import('../pages/MapPage')).MapPage,
        }),
      },
      {
        path: 'auth',
        lazy: async () => ({
          Component: (await import('../pages/AuthPage')).AuthPage,
        }),
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        Component: AdminIndexRedirect,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedAdminRoute>
            <AdminDashboardPage />
          </ProtectedAdminRoute>
        ),
      },
      {
        path: 'products',
        element: (
          <ProtectedAdminRoute>
            <AdminProductsPage />
          </ProtectedAdminRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    lazy: async () => ({
      Component: (await import('../pages/NotFoundPage')).NotFoundPage,
    }),
  },
])
