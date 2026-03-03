"use client";

export function ExportButton({ urls }: { urls: string[] }) {
  const handleExport = () => {
    const text = urls.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookmarks.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      aria-label="Export URLs"
      title="Export URLs to text file"
      className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
      </svg>
    </button>
  );
}
