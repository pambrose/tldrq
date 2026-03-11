"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function ShareButton() {
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const collection = searchParams.get("collection");
      const res = await fetch("/api/shared-views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection_id: collection && collection !== "uncategorized" ? collection : null,
          collection_uncategorized: collection === "uncategorized",
          filter: searchParams.get("filter") || null,
          priority: searchParams.get("priority") || null,
          sort: searchParams.get("sort") || null,
          search: searchParams.get("search") || null,
          title: title.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to create share link");
        return;
      }

      const data = await res.json();
      setShareUrl(`${window.location.origin}${data.url}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setShareUrl(null);
    setTitle("");
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={showForm ? handleClose : () => setShowForm(true)}
        disabled={loading}
        aria-label="Share displayed URLs"
        title="Share displayed URLs"
        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {showForm && (
        <div className="absolute right-0 top-8 z-10 rounded-lg border bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-gray-800" style={{ width: "360px" }}>
          <button
            onClick={handleClose}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label="Close share dialog"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {shareUrl ? (
            <>
              <p className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">Share link</p>
              <div className="flex items-center gap-1">
                <code className="block min-w-0 flex-1 truncate rounded bg-gray-100 px-2 py-1 text-xs text-blue-600 dark:bg-gray-700 dark:text-blue-400">
                  {shareUrl}
                </code>
                <button
                  onClick={handleCopy}
                  className="shrink-0 rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700"
                  style={{ width: "56px", textAlign: "center" }}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title (optional)"
                className="mb-2 w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-400"
              />
              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {loading ? "Creating…" : "Create link"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
