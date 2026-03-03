"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Collection } from "@/types/database";

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

  const pillClass = (active: boolean) =>
    `rounded-full px-3 py-1 text-sm font-medium transition-colors ${
      active
        ? "bg-blue-100 text-blue-700"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-gray-500 uppercase">Collections:</span>
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
      {collections.map((c) => (
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
            className="w-28 rounded-full border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleCreate}
            className="rounded-full bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
          >
            Add
          </button>
          <button
            onClick={() => { setIsCreating(false); setNewName(""); }}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="rounded-full border border-dashed border-gray-300 px-3 py-1 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          + New
        </button>
      )}
    </div>
  );
}
