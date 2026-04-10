"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const COLORS = [
  "#6366f1", // indigo
  "#ec4899", // pink
  "#f97316", // orange
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ef4444", // red
  "#14b8a6", // teal
  "#f59e0b", // amber
  "#6b7280", // gray
];

export function CreateBlockModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    await fetch("/api/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), color }),
    });
    setSaving(false);
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[var(--card-bg)] rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold">New Job Block</h2>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--foreground)]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Job Category
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Software Engineer, Data Scientist..."
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? "var(--foreground)" : "transparent",
                  }}
                >
                  {color === c && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex justify-center">
            <div
              className="w-32 aspect-[3/4] rounded-xl flex flex-col items-center justify-center shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${color}22, ${color}44)`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: color }}
              >
                <span className="text-white text-lg">B</span>
              </div>
              <span className="text-xs font-medium text-center px-2 line-clamp-2">
                {title || "Preview"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim() || saving}
            className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-white font-medium text-sm disabled:opacity-50 hover:opacity-90"
          >
            {saving ? "Creating..." : "Create Block"}
          </button>
        </form>
      </div>
    </div>
  );
}
