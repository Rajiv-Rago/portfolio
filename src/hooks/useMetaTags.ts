import { useEffect } from 'react'

interface MetaTagsOptions {
  title: string
  description?: string
  ogType?: string
  ogImage?: string | null
  article?: {
    publishedTime?: string
    tags?: string[]
  }
  jsonLd?: Record<string, unknown>
}

export function useMetaTags({ title, description, ogType = 'website', ogImage, article, jsonLd }: MetaTagsOptions) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    const tags: HTMLElement[] = []

    function setMeta(property: string, content: string) {
      const el = document.createElement('meta')
      el.setAttribute(property.startsWith('og:') || property.startsWith('article:') ? 'property' : 'name', property)
      el.setAttribute('content', content)
      document.head.appendChild(el)
      tags.push(el)
    }

    if (description) {
      setMeta('description', description)
      setMeta('og:description', description)
      setMeta('twitter:description', description)
    }

    setMeta('og:title', title)
    setMeta('og:type', ogType)
    setMeta('twitter:card', ogImage ? 'summary_large_image' : 'summary')
    setMeta('twitter:title', title)

    if (ogImage) {
      setMeta('og:image', ogImage)
      setMeta('twitter:image', ogImage)
    }

    if (article?.publishedTime) {
      setMeta('article:published_time', article.publishedTime)
    }

    if (article?.tags) {
      article.tags.forEach(tag => setMeta('article:tag', tag))
    }

    if (jsonLd) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
      tags.push(script)
    }

    return () => {
      document.title = prevTitle
      tags.forEach(el => el.remove())
    }
  }, [title, description, ogType, ogImage, article, jsonLd])
}
