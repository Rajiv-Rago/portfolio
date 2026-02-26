import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import PortfolioPage from './pages/PortfolioPage'
import BlogListPage from './pages/BlogListPage'
import BlogPage from './pages/BlogPage'
import NotFoundPage from './pages/NotFoundPage'
import ErrorBoundary from './components/ui/ErrorBoundary'
import LoadingSpinner from './components/ui/LoadingSpinner'

const AdminLayout = lazy(() => import('./admin/AdminLayout'))

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPage />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <AdminLayout />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  )
}
