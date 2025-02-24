export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col items-center space-y-4 mb-8 text-center">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      </div>

      {/* Products section loading */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="flex gap-4">
                {/* Image placeholder */}
                <div className="w-20 h-20 bg-muted rounded-md" />
                
                {/* Content placeholder */}
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders loading */}
      <div className="mt-8 space-y-4">
        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-4 bg-muted rounded w-48" />
                </div>
                <div className="h-6 w-20 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
} 