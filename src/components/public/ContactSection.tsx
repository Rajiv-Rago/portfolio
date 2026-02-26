import type { Profile } from '../../lib/types'
import ContactLinks from './ContactLinks'
import ContactForm from './ContactForm'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function ContactSection({ profile }: { profile: Profile }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div ref={ref} id="contact" className={`scroll-reveal ${isVisible ? 'is-visible' : ''} max-w-[1000px] mx-auto mb-20 px-12 max-md:px-6`}>
      <h2 className="text-2xl font-normal mb-6 inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[3px] after:rounded-sm after:bg-accent">
        Get in Touch
      </h2>
      <div className="grid grid-cols-2 gap-12 max-md:grid-cols-1 max-md:gap-8">
        <ContactLinks profile={profile} />
        <ContactForm />
      </div>
    </div>
  )
}
