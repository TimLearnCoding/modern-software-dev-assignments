"use client";

import { JobPost } from "@/types";
import {
  ExternalLink,
  MapPin,
  DollarSign,
  Building2,
  Trash2,
  Undo2,
  Check,
} from "lucide-react";

interface Props {
  job: JobPost;
  isApplied?: boolean;
  onApply?: () => void;
  onUnapply?: () => void;
  onDelete: () => void;
  onViewDetail: () => void;
}

export function JobCard({
  job,
  isApplied,
  onApply,
  onUnapply,
  onDelete,
  onViewDetail,
}: Props) {
  return (
    <div
      className={`group p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:shadow-md ${
        isApplied ? "opacity-80" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Job Title - clickable for details */}
          <button
            onClick={onViewDetail}
            className="text-sm font-semibold text-left hover:text-[var(--accent)] line-clamp-1 w-full"
          >
            {job.title}
          </button>

          {/* Company */}
          <div className="flex items-center gap-1.5 mt-1">
            <Building2 size={12} className="text-[var(--muted)] shrink-0" />
            <span className="text-xs text-[var(--muted)] truncate">
              {job.company}
            </span>
          </div>

          {/* Location & Salary */}
          <div className="flex items-center gap-3 mt-1.5">
            {job.location && (
              <div className="flex items-center gap-1">
                <MapPin size={11} className="text-[var(--muted)] shrink-0" />
                <span className="text-xs text-[var(--muted)] truncate">
                  {job.location}
                </span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center gap-1">
                <DollarSign size={11} className="text-[var(--muted)] shrink-0" />
                <span className="text-xs text-[var(--muted)]">{job.salary}</span>
              </div>
            )}
          </div>

          {/* Source badge */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--background)] text-[var(--muted)] border border-[var(--border)]">
              {job.source}
            </span>
            {isApplied && job.appliedAt && (
              <span className="text-[10px] text-[var(--success)]">
                Applied {new Date(job.appliedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {isApplied ? (
            <button
              onClick={onUnapply}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)]"
              title="Move back to To Apply"
            >
              <Undo2 size={12} />
            </button>
          ) : (
            <button
              onClick={onApply}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:opacity-90"
              title="Open job link & mark as applied"
            >
              <Check size={12} />
              Apply
            </button>
          )}

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded text-[var(--muted)] hover:text-[var(--accent)]"
              title="Open job page"
            >
              <ExternalLink size={12} />
            </a>
            <button
              onClick={onDelete}
              className="p-1 rounded text-[var(--muted)] hover:text-red-500"
              title="Remove job"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
