import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import PortfolioPage from './pages/PortfolioPage'
import BlogPage from './pages/BlogPage'
import NotFoundPage from './pages/NotFoundPage'
import LoadingSpinner from './components/ui/LoadingSpinner'

const AdminLayout = lazy(() => import('./admin/AdminLayout'))

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
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
  )
}
