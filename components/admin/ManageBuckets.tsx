"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initialBuckets: string[];
};

export default function ManageBuckets({ initialBuckets }: Props) {
  const router = useRouter();
  const [buckets, setBuckets] = useState<string[]>(initialBuckets);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [newBucket, setNewBucket] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);

  async function saveBucketsList(
    updatedList: string[],
    renames: { from: string; to: string }[] = [],
    deletes: string[] = []
  ) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/media/buckets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buckets: updatedList,
          renames,
          deletes,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Failed to save buckets");
      }
      setBuckets(json.buckets);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update buckets");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddBucket(e: React.FormEvent) {
    e.preventDefault();
    const name = newBucket.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    if (!name) return;
    if (buckets.includes(name)) {
      setError("Bucket already exists");
      return;
    }
    const updated = [...buckets, name];
    setNewBucket("");
    await saveBucketsList(updated);
  }

  async function handleMove(index: number, direction: "up" | "down") {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === buckets.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...buckets];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setBuckets(updated);
    await saveBucketsList(updated);
  }

  function startRename(index: number) {
    setEditingIndex(index);
    setEditingValue(buckets[index]);
  }

  async function saveRename(index: number) {
    const to = editingValue.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    const from = buckets[index];
    if (!to || from === to) {
      setEditingIndex(null);
      return;
    }
    if (buckets.includes(to) && buckets.indexOf(to) !== index) {
      setError("Bucket already exists");
      return;
    }

    const updated = [...buckets];
    updated[index] = to;

    setEditingIndex(null);
    await saveBucketsList(updated, [{ from, to }]);
  }

  async function handleDelete(index: number) {
    const deleted = buckets[index];
    const updated = buckets.filter((_, i) => i !== index);
    setConfirmDeleteIndex(null);
    await saveBucketsList(updated, [], [deleted]);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Manage Media Buckets</h3>
          <p className="text-xs text-slate-600">Add, rename, remove or reorder your media storage buckets</p>
        </div>
        {loading && (
          <span className="flex h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        )}
      </div>

      {error && <p className="mt-3 text-xs text-red-600 font-medium bg-red-50 p-2 rounded border border-red-100">{error}</p>}

      {/* List of Buckets */}
      <div className="mt-4 space-y-2">
        {buckets.map((bucket, index) => {
          const isEditing = editingIndex === index;
          const isConfirmingDelete = confirmDeleteIndex === index;

            return (
            <div
              key={bucket}
              className="flex items-center justify-between rounded-md border border-slate-200/70 bg-slate-50 p-2.5 transition hover:border-slate-300"
            >
              {isEditing ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveRename(index);
                      if (e.key === "Escape") setEditingIndex(null);
                    }}
                  />
                  <button
                    onClick={() => saveRename(index)}
                    className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : isConfirmingDelete ? (
                <div className="flex flex-1 items-center justify-between bg-red-50 p-1 rounded border border-red-100">
                  <span className="text-xs text-red-600 font-medium pl-1">
                    Delete bucket and migrate its items to "gallery"?
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleDelete(index)}
                      className="rounded bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white hover:bg-red-500"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteIndex(null)}
                      className="rounded bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    {/* Move Controls */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0 || loading}
                        className="text-[9px] text-zinc-500 hover:text-amber-500 disabled:opacity-30 disabled:hover:text-zinc-500"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMove(index, "down")}
                        disabled={index === buckets.length - 1 || loading}
                        className="text-[9px] text-zinc-500 hover:text-amber-500 disabled:opacity-30 disabled:hover:text-zinc-500"
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>

                    <span className="text-sm font-semibold text-slate-900">{bucket}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startRename(index)}
                      disabled={loading}
                      className="rounded border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-slate-300 disabled:opacity-50"
                    >
                      Rename
                    </button>
                    {bucket !== "gallery" && (
                      <button
                        onClick={() => setConfirmDeleteIndex(index)}
                        disabled={loading}
                        className="rounded border border-red-100 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Bucket Form */}
      <form onSubmit={handleAddBucket} className="mt-4 flex gap-2 border-t border-zinc-800 pt-4">
        <input
          type="text"
          className="flex-1 rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
          placeholder="New bucket name (e.g. brochures)"
          value={newBucket}
          onChange={(e) => setNewBucket(e.target.value)}
          disabled={loading}
          required
        />
        <button
          type="submit"
          disabled={loading || !newBucket.trim()}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
        >
          Add Bucket
        </button>
      </form>
    </div>
  );
}
