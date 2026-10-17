import { createBrowserRouter } from 'react-router-dom'

import { ProtectedAdminRoute } from '../components/auth/ProtectedAdminRoute'
import { MainLayout } from '../layouts/MainLayout'
import { AdminLayout } from '../layouts/AdminLayout'
import { AdminIndexRedirect } from '../pages/admin/AdminIndexRedirect'

export const router = createBrowserRouter([
  {
    path: '/',
    hydrateFallbackElement: (
      <div className="route-pending" role="status">
        ENERGION <span>Preparing your next direction...</span>
      </div>
    ),
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
        path: 'products/:slug',
        lazy: async () => ({
          Component: (await import('../pages/ProductDetailsPage')).ProductDetailsPage,
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
    hydrateFallbackElement: (
      <div className="route-pending" role="status">
        ENERGION <span>Opening your workspace...</span>
      </div>
    ),
    element: <AdminLayout />,
    children: [
      {
        index: true,
        Component: AdminIndexRedirect,
      },
      {
        path: 'dashboard',
        lazy: async () => {
          const { AdminDashboardPage } = await import('../pages/admin/AdminDashboardPage')
          return {
            Component: function AdminDashboardRoute() {
              return (
                <ProtectedAdminRoute>
                  <AdminDashboardPage />
                </ProtectedAdminRoute>
              )
            },
          }
        },
      },
      {
        path: 'products',
        lazy: async () => {
          const { AdminProductsPage } = await import('../pages/admin/AdminProductsPage')
          return {
            Component: function AdminProductsRoute() {
              return (
                <ProtectedAdminRoute>
                  <AdminProductsPage />
                </ProtectedAdminRoute>
              )
            },
          }
        },
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
