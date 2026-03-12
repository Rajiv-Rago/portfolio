import Skeleton from './Skeleton'

function NavSkeleton() {
  return (
    <div className="sticky top-0 z-50 bg-bg/90 backdrop-blur-xl border-b border-border/60 px-12 max-md:px-6 py-4 flex items-center justify-between">
      <Skeleton className="w-32 h-5" />
      <div className="flex gap-4">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-16 h-4" />
      </div>
    </div>
  )
}

function HeroSkeleton() {
  return (
    <div className="max-w-[1000px] mx-auto px-12 pt-20 pb-24 flex flex-col items-center text-center max-md:px-6 max-md:pt-14 max-md:pb-16">
      <Skeleton className="w-[170px] h-[170px] mb-8" />
      <Skeleton className="w-72 h-12 mb-3" />
      <Skeleton className="w-44 h-5 mb-5" />
      <Skeleton className="w-96 h-4 mb-2 max-md:w-64" />
      <Skeleton className="w-80 h-4 mb-7 max-md:w-56" />
      <Skeleton className="w-40 h-10 rounded-[--radius-md]" />
    </div>
  )
}

function SectionSkeleton({ columns = 3 }: { columns?: number }) {
  return (
    <div className="max-w-[1000px] mx-auto mb-24 px-12 max-md:px-6">
      <Skeleton className="w-36 h-9 mb-10" />
      <div className={`grid gap-6 max-md:grid-cols-1 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="bg-surface border border-border/80 rounded-[--radius-lg] p-6">
            <Skeleton className="w-full h-40 mb-5" />
            <Skeleton className="w-3/4 h-5 mb-2" />
            <Skeleton className="w-full h-4 mb-1" />
            <Skeleton className="w-2/3 h-4" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PortfolioSkeleton() {
  return (
    <>
      <NavSkeleton />
      <main>
        <HeroSkeleton />
        <SectionSkeleton columns={3} />
        <SectionSkeleton columns={2} />
      </main>
    </>
  )
}
