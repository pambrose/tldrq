"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Collection } from "@/types/database";
import { pillClass } from "@/lib/utils/ui";

export function CollectionTabs({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCollection = searchParams.get("collection") || "";
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const setCollection = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("collection", value);
    } else {
      params.delete("collection");
    }
    router.push(`/?${params.toString()}`);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (res.ok) {
      setNewName("");
      setIsCreating(false);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Collections:</span>
      <button
        onClick={() => setCollection("")}
        className={pillClass(!currentCollection)}
      >
        All
      </button>
      <button
        onClick={() => setCollection("uncategorized")}
        className={pillClass(currentCollection === "uncategorized")}
      >
        Uncategorized
      </button>
      {[...collections].sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
        <button
          key={c.id}
          onClick={() => setCollection(c.id)}
          className={pillClass(currentCollection === c.id)}
        >
          {c.name}
        </button>
      ))}
      {isCreating ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Name"
            autoFocus
            className="w-28 rounded-full border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          <button
            onClick={handleCreate}
            className="rounded-full bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
          >
            Add
          </button>
          <button
            onClick={() => { setIsCreating(false); setNewName(""); }}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="rounded-full border border-dashed border-gray-300 px-3 py-1 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300"
        >
          + New
        </button>
      )}
    </div>
  );
}
