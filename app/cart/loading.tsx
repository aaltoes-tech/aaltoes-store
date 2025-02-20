export default function Loading() {
  return (
    <div className="p-8 text-center text-muted-foreground">
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-muted rounded w-1/4 mx-auto" />
        <div className="space-y-4">
          <div className="h-24 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
} 