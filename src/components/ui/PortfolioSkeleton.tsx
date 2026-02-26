import Skeleton from './Skeleton'

function NavSkeleton() {
  return (
    <div className="sticky top-0 z-50 bg-surface border-b border-border px-12 max-md:px-6 py-4 flex items-center justify-between">
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
    <div className="mx-12 mt-8 mb-16 p-12 rounded-[--radius-xl] bg-gradient-to-br from-accent-light/30 via-gray-100/30 to-indigo-100/30 flex flex-col items-center text-center max-md:mx-4 max-md:p-8">
      <Skeleton className="w-[130px] h-[130px] rounded-[--radius-xl] mb-4" />
      <Skeleton className="w-64 h-9 mb-2" />
      <Skeleton className="w-40 h-5 mb-4" />
      <Skeleton className="w-80 h-4 mb-2" />
      <Skeleton className="w-72 h-4 mb-5" />
      <Skeleton className="w-40 h-10 rounded-[--radius-md]" />
    </div>
  )
}

function SectionSkeleton({ columns = 3 }: { columns?: number }) {
  return (
    <div className="max-w-[1000px] mx-auto mb-20 px-12 max-md:px-6">
      <Skeleton className="w-32 h-7 mb-6" />
      <div className={`grid gap-5 max-md:grid-cols-1 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-[--radius-lg] p-6">
            <Skeleton className="w-full h-40 mb-4" />
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
