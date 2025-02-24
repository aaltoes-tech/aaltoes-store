export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-center mb-8">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
      </div>
      
      <div className="flex justify-between mb-8">
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="space-y-6">
          {/* Simulate 3 cart items loading */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border rounded-lg animate-pulse">
              {/* Image placeholder */}
              <div className="relative w-20 h-20 bg-muted rounded-md" />
              
              {/* Content placeholder */}
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-6 bg-muted rounded w-24" />
              </div>
              
              {/* Price placeholder */}
              <div className="text-right space-y-2">
                <div className="h-4 bg-muted rounded w-16" />
                <div className="h-4 bg-muted rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 