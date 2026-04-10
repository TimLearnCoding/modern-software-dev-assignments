"use client";

import { JobBlock } from "@/types";
import { Briefcase, FileText, CheckCircle2 } from "lucide-react";

interface Props {
  block: JobBlock;
  onClick: () => void;
}

export function BlockCard({ block, onClick }: Props) {
  const toApply = block.jobs.filter((j) => j.status === "to_apply").length;
  const applied = block.jobs.filter((j) => j.status === "applied").length;

  return (
    <button
      onClick={onClick}
      className="group text-left rounded-2xl overflow-hidden shadow-sm hover:shadow-lg bg-[var(--card-bg)] border border-[var(--border)] hover:border-transparent"
      style={{ transition: "all 0.2s ease" }}
    >
      {/* Cover - like a book cover */}
      <div
        className="aspect-[3/4] relative flex flex-col items-center justify-center p-5"
        style={{
          background: `linear-gradient(135deg, ${block.color}22, ${block.color}44)`,
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm"
          style={{ backgroundColor: block.color }}
        >
          <Briefcase size={24} className="text-white" />
        </div>
        <h3 className="text-base font-semibold text-center leading-tight line-clamp-2">
          {block.title}
        </h3>

        {/* Resume indicator */}
        {block.resumePath && (
          <div className="absolute top-3 right-3">
            <FileText size={14} className="text-[var(--muted)]" />
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="px-4 py-3 flex items-center justify-between text-xs border-t border-[var(--border)]">
        <span className="flex items-center gap-1 text-[var(--accent)] font-medium">
          {toApply > 0 ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              {toApply} to apply
            </>
          ) : (
            <span className="text-[var(--muted)]">No jobs yet</span>
          )}
        </span>
        {applied > 0 && (
          <span className="flex items-center gap-1 text-[var(--success)]">
            <CheckCircle2 size={12} />
            {applied}
          </span>
        )}
      </div>
    </button>
  );
}
