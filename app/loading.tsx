export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-md mx-auto px-4">
        <div className="h-8 bg-surface rounded w-1/2 mx-auto"></div>
        <div className="space-y-3">
          <div className="h-32 bg-surface rounded"></div>
          <div className="h-24 bg-surface rounded"></div>
          <div className="h-12 bg-surface rounded"></div>
        </div>
      </div>
    </div>
  );
}
