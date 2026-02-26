export function getReadingTime(text: string, wpm = 200): string {
  const stripped = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_~]+/g, '')
    .replace(/>\s/g, '')
  const words = stripped.trim().split(/\s+/).filter(Boolean)
  return `${Math.max(1, Math.ceil(words.length / wpm))} min read`
}
