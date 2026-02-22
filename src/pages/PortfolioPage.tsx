import { useMemo } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useProjects } from '../hooks/useProjects'
import { useExperience } from '../hooks/useExperience'
import { useBlogPosts } from '../hooks/useBlogPosts'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/public/HeroSection'
import ProjectsSection from '../components/public/ProjectsSection'
import ExperienceSection from '../components/public/ExperienceSection'
import BlogSection from '../components/public/BlogSection'
import ContactSection from '../components/public/ContactSection'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function PortfolioPage() {
  const { profile, loading: profileLoading } = useProfile()
  const { projects } = useProjects()
  const { experience } = useExperience()
  const { posts } = useBlogPosts()

  const sections = useMemo(() => {
    const s: { id: string; label: string }[] = []
    if (projects.length > 0) s.push({ id: 'projects', label: 'Projects' })
    if (experience.length > 0) s.push({ id: 'experience', label: 'Experience' })
    if (posts.length > 0) s.push({ id: 'blog', label: 'Blog' })
    s.push({ id: 'contact', label: 'Contact' })
    return s
  }, [projects.length, experience.length, posts.length])

  if (profileLoading) return <LoadingSpinner fullScreen />
  if (!profile) return <LoadingSpinner fullScreen />

  return (
    <>
      <Navbar name={profile.name} sections={sections} />
      <main>
        <HeroSection profile={profile} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experience={experience} />
        <BlogSection posts={posts} />
        <ContactSection profile={profile} />
      </main>
      <Footer name={profile.name} />
    </>
  )
}
