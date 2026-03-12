import type { Profile } from '../../lib/types'
import ContactLinks from './ContactLinks'
import ContactForm from './ContactForm'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function ContactSection({ profile }: { profile: Profile }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div ref={ref} id="contact" className={`scroll-reveal ${isVisible ? 'is-visible' : ''} max-w-[1000px] mx-auto mb-24 px-12 max-md:px-6`}>
      <h2 className="section-heading text-base font-heading uppercase tracking-widest mb-10 inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-full after:h-[2px] after:rounded-sm after:bg-accent/40 after:origin-left">
        <span className="text-muted">## </span>Get in Touch
      </h2>
      <div className="grid grid-cols-2 gap-12 max-md:grid-cols-1 max-md:gap-8">
        <ContactLinks profile={profile} />
        <ContactForm />
      </div>
    </div>
  )
}
