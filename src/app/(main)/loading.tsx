export default function Loading() {
  return (
    <div role="status" aria-label="Loading bookmarks" className="animate-pulse space-y-6">
      <div className="h-10 rounded-lg bg-gray-200 dark:bg-gray-800" />
      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-24 rounded-lg bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    </div>
  );
}
