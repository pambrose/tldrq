"use client";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="max-w-sm space-y-4 text-center">
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          This page couldn&rsquo;t be loaded
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          tldrq.com may be having a temporary problem.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
