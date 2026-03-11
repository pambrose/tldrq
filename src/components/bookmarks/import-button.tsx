"use client";

import { useState } from "react";
import { BulkImport } from "./bulk-import";
import type { Collection } from "@/types/database";

export function ImportButton({ collections }: { collections: Collection[] }) {
  const [showBulkImport, setShowBulkImport] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowBulkImport((v) => !v)}
        aria-label="Import URLs"
        title="Import URLs from text"
        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </button>
      {showBulkImport && (
        <BulkImport
          collections={collections}
          onClose={() => setShowBulkImport(false)}
        />
      )}
    </>
  );
}
