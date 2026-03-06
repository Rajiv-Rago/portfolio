import { useMemo } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useProjects } from '../hooks/useProjects'
import { useExperience } from '../hooks/useExperience'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { useMetaTags } from '../hooks/useMetaTags'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/public/HeroSection'
import ProjectsSection from '../components/public/ProjectsSection'
import ExperienceSection from '../components/public/ExperienceSection'
import BlogSection from '../components/public/BlogSection'
import ContactSection from '../components/public/ContactSection'
import PortfolioSkeleton from '../components/ui/PortfolioSkeleton'

function SectionDivider() {
  return (
    <div className="max-w-[1000px] mx-auto px-12 max-md:px-6">
      <hr className="border-t border-border" />
    </div>
  )
}

export default function PortfolioPage() {
  const { profile, loading: profileLoading } = useProfile()
  const { projects } = useProjects()
  const { experience } = useExperience()
  const { posts } = useBlogPosts()

  useMetaTags({
    title: profile ? `${profile.name} \u2014 ${profile.title}` : 'Portfolio',
    description: profile?.bio?.slice(0, 160),
    ogType: 'website',
    ogImage: profile?.avatar_url,
    jsonLd: profile ? {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.title,
      description: profile.bio,
      ...(profile.email && { email: `mailto:${profile.email}` }),
      ...(profile.github && { sameAs: [profile.github, ...(profile.linkedin ? [profile.linkedin] : [])] }),
    } : undefined,
  })

  const sections = useMemo(() => {
    const s: { id: string; label: string }[] = []
    if (projects.length > 0) s.push({ id: 'projects', label: 'Projects' })
    if (experience.length > 0) s.push({ id: 'experience', label: 'Experience' })
    if (posts.length > 0) s.push({ id: 'blog', label: 'Blog' })
    s.push({ id: 'contact', label: 'Contact' })
    return s
  }, [projects.length, experience.length, posts.length])

  if (profileLoading) return <PortfolioSkeleton />
  if (!profile) return <PortfolioSkeleton />

  return (
    <>
      <Navbar name={profile.name} sections={sections} />
      <main>
        <HeroSection profile={profile} />
        <SectionDivider />
        <ProjectsSection projects={projects} />
        <SectionDivider />
        <ExperienceSection experience={experience} />
        <SectionDivider />
        <BlogSection posts={posts} />
        <SectionDivider />
        <ContactSection profile={profile} />
      </main>
      <Footer name={profile.name} email={profile.email} github={profile.github} linkedin={profile.linkedin} />
    </>
  )
}
