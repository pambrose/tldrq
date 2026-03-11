"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Collection } from "@/types/database";
import { PRIORITY_LEVELS, PRIORITY_LABELS } from "@/lib/utils/priority";
import type { Priority } from "@/lib/utils/priority";

type ResultStatus = "success" | "skipped" | "invalid" | "error";

interface ImportResult {
  url: string;
  status: ResultStatus;
  message: string;
}

export function BulkImport({
  collections,
  onClose,
}: {
  collections: Collection[];
  onClose: () => void;
}) {
  const [collectionId, setCollectionId] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [urls, setUrls] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [os, setOs] = useState<"macOS" | "Windows" | "Linux">("macOS");
  const [browser, setBrowser] = useState("Safari");
  const abortRef = useRef<AbortController | null>(null);
  const router = useRouter();

  useEffect(() => {
    const ua = navigator.userAgent;
    if (ua.includes("Win")) {
      setOs("Windows"); // eslint-disable-line react-hooks/set-state-in-effect -- detecting OS on mount
      setBrowser("Chrome");
    } else if (!ua.includes("Mac")) {
      setOs("Linux");
      setBrowser("Chrome");
    }
  }, []);

  const firefoxConsoleNote = `Open the Browser Console (${os === "macOS" ? "Cmd" : "Ctrl"}+Shift+J), run this command, then paste the result into a text file.`;
  const extensionNote = `Install a "Copy All Tab URLs" extension from your browser's extension store, then use it to copy all tab URLs and paste into a text file.`;

  const allBrowserCommands: Record<string, Record<string, { command?: string; note?: string }>> = {
    macOS: {
      Safari: { command: `osascript -e 'set text item delimiters to linefeed' -e 'tell app "Safari" to (url of tabs of windows) as text' > safari-urls.txt` },
      Chrome: { command: `osascript -e 'set text item delimiters to linefeed' -e 'tell app "Google Chrome" to (url of tabs of windows) as text' > chrome-urls.txt` },
      "Microsoft Edge": { command: `osascript -e 'set text item delimiters to linefeed' -e 'tell app "Microsoft Edge" to (url of tabs of windows) as text' > edge-urls.txt` },
      Brave: { command: `osascript -e 'set text item delimiters to linefeed' -e 'tell app "Brave Browser" to (url of tabs of windows) as text' > brave-urls.txt` },
      Firefox: { command: `copy([...gBrowser.tabs].map(t => t.linkedBrowser.currentURI.spec).join('\\n'))`, note: firefoxConsoleNote },
    },
    Windows: {
      Chrome: { note: extensionNote },
      "Microsoft Edge": { note: extensionNote },
      Firefox: { command: `copy([...gBrowser.tabs].map(t => t.linkedBrowser.currentURI.spec).join('\\n'))`, note: firefoxConsoleNote },
      Brave: { note: extensionNote },
    },
    Linux: {
      Chrome: { note: extensionNote },
      Firefox: { command: `copy([...gBrowser.tabs].map(t => t.linkedBrowser.currentURI.spec).join('\\n'))`, note: firefoxConsoleNote },
      "Microsoft Edge": { note: extensionNote },
      Brave: { note: extensionNote },
    },
  };

  const browserCommands = allBrowserCommands[os];
  const currentCommand = browserCommands[browser];

  const handleCopy = async () => {
    if (!currentCommand?.command) return;
    await navigator.clipboard.writeText(currentCommand.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      setUrls(parsed);
      setResults([]);
      setDone(false);
    };
    reader.readAsText(file);
  };

  const handleStart = async () => {
    const controller = new AbortController();
    abortRef.current = controller;
    setImporting(true);
    setResults([]);
    setCurrentIndex(0);
    setDone(false);

    for (let i = 0; i < urls.length; i++) {
      if (controller.signal.aborted) break;

      setCurrentIndex(i);
      const url = urls[i];

      // Flag invalid URLs without hitting the API
      let isValid = false;
      try {
        const parsed = new URL(url);
        isValid = parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch { /* invalid */ }

      if (!isValid) {
        setResults((prev) => [
          ...prev,
          { url, status: "invalid", message: "Invalid URL" },
        ]);
        continue;
      }

      try {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url,
            collection_id: collectionId || null,
            priority,
          }),
          signal: controller.signal,
        });

        if (res.status === 201) {
          setResults((prev) => [
            ...prev,
            { url, status: "success", message: "Imported" },
          ]);
        } else if (res.status === 409) {
          setResults((prev) => [
            ...prev,
            { url, status: "skipped", message: "Duplicate" },
          ]);
        } else {
          const data = await res.json();
          setResults((prev) => [
            ...prev,
            { url, status: "error", message: data.error || "Failed" },
          ]);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          break;
        }
        setResults((prev) => [
          ...prev,
          { url, status: "error", message: "Network error" },
        ]);
      }
    }

    setImporting(false);
    setDone(true);
    abortRef.current = null;
    router.refresh();
  };

  const handleCancel = () => {
    abortRef.current?.abort();
  };

  const handleClear = () => {
    setUrls([]);
    setResults([]);
    setDone(false);
  };

  const successCount = results.filter((r) => r.status === "success").length;
  const skippedCount = results.filter((r) => r.status === "skipped").length;
  const invalidCount = results.filter((r) => r.status === "invalid").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Bulk Import
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          aria-label="Close bulk import"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* File picker — shown when no URLs are loaded */}
      {urls.length === 0 && !importing && (
        <div>
          <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
            Select a <code>.txt</code> file with one URL per line.
          </p>
          <input
            type="file"
            accept=".txt,text/plain"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100 dark:text-gray-400 dark:file:bg-blue-900/30 dark:file:text-blue-400 dark:hover:file:bg-blue-900/50"
          />
          <details className="mt-3" open>
            <summary className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 select-none">
              How to gather the URLs of all your browser tabs on {os}
            </summary>
            <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-2 flex items-center gap-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">Browser:</label>
                <select
                  value={browser}
                  onChange={(e) => { setBrowser(e.target.value); setCopied(false); }}
                  className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                >
                  {Object.keys(browserCommands).map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              {currentCommand?.note && (
                <p className={`mb-2 text-xs ${currentCommand.command ? "text-amber-600 dark:text-amber-400" : "text-gray-600 dark:text-gray-400"}`}>
                  {currentCommand.note}
                </p>
              )}
              {!currentCommand?.note && (
                <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">
                  Run this command in your terminal to export all open tab URLs to a file:
                </p>
              )}
              {currentCommand?.command && (
                <div className="flex items-start gap-2">
                  <code className="flex-1 whitespace-pre-wrap break-all rounded bg-gray-200 px-2 py-1.5 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {currentCommand.command}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>
          </details>
        </div>
      )}

      {/* Pre-import summary — URLs parsed, not yet importing */}
      {urls.length > 0 && !importing && !done && (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Found <span className="font-medium">{urls.length}</span> line
            {urls.length !== 1 && "s"} to import. Invalid URLs will be flagged.
          </p>
          <div className="flex flex-wrap gap-2">
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="">Auto-categorize</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            >
              {PRIORITY_LEVELS.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleStart}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Start Import
            </button>
            <button
              onClick={handleClear}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Progress — during import */}
      {importing && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
            <span>
              Importing {currentIndex + 1} of {urls.length}…
            </span>
            <button
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${((results.length) / urls.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Results — shown during import and after completion */}
      {results.length > 0 && (
        <div className="mt-3 space-y-2">
          <div className="flex gap-3 text-xs">
            {successCount > 0 && (
              <span className="text-green-600 dark:text-green-400">
                {successCount} imported
              </span>
            )}
            {skippedCount > 0 && (
              <span className="text-yellow-600 dark:text-yellow-400">
                {skippedCount} skipped
              </span>
            )}
            {invalidCount > 0 && (
              <span className="text-orange-600 dark:text-orange-400">
                {invalidCount} invalid
              </span>
            )}
            {errorCount > 0 && (
              <span className="text-red-600 dark:text-red-400">
                {errorCount} failed
              </span>
            )}
          </div>
          <div className="max-h-40 overflow-y-auto rounded border border-gray-200 dark:border-gray-700">
            {results.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-2 border-b border-gray-100 px-2 py-1.5 text-xs last:border-b-0 dark:border-gray-800"
              >
                {r.status === "success" && (
                  <span className="mt-0.5 shrink-0 text-green-500">✓</span>
                )}
                {r.status === "skipped" && (
                  <span className="mt-0.5 shrink-0 text-yellow-500">—</span>
                )}
                {r.status === "invalid" && (
                  <span className="mt-0.5 shrink-0 text-orange-500">!</span>
                )}
                {r.status === "error" && (
                  <span className="mt-0.5 shrink-0 text-red-500">✗</span>
                )}
                <span className="min-w-0 break-all text-gray-600 dark:text-gray-400">
                  {r.url}
                </span>
                <span className="ml-auto shrink-0 text-gray-400 dark:text-gray-500">
                  {r.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Done state */}
      {done && (
        <div className="mt-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
