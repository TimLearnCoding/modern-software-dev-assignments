"use client";

import { JobPost } from "@/types";
import {
  X,
  ExternalLink,
  MapPin,
  DollarSign,
  Building2,
  Globe,
  Check,
} from "lucide-react";

interface Props {
  job: JobPost;
  onClose: () => void;
  onApply?: () => void;
}

export function JobDetailModal({ job, onClose, onApply }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-16 pb-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - LinkedIn-style */}
        <div
          className="h-20 relative"
          style={{
            background: `linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40"
          >
            <X size={16} />
          </button>
        </div>

        {/* Company "avatar" */}
        <div className="px-6 -mt-8 relative">
          <div className="w-16 h-16 rounded-xl bg-white border-4 border-white shadow-md flex items-center justify-center">
            <Building2 size={28} className="text-[var(--accent)]" />
          </div>
        </div>

        {/* Job Info */}
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold">{job.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-[var(--accent)]">
              {job.company}
            </span>
            {job.location && (
              <>
                <span className="text-[var(--muted)]">&middot;</span>
                <span className="flex items-center gap-1 text-sm text-[var(--muted)]">
                  <MapPin size={13} />
                  {job.location}
                </span>
              </>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {job.salary && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                <DollarSign size={12} />
                {job.salary}
              </span>
            )}
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-xs font-medium">
              <Globe size={12} />
              {job.source}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-4">
            {onApply && (
              <button
                onClick={onApply}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
              >
                <Check size={16} />
                Apply Now
              </button>
            )}
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--border)] text-sm font-medium hover:bg-[var(--background)]"
            >
              <ExternalLink size={14} />
              View Original
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--border)] mx-6" />

        {/* Description */}
        <div className="px-6 py-5">
          <h3 className="font-semibold mb-3">About the job</h3>
          {job.description ? (
            <div
              className="job-description text-sm text-[var(--foreground)]/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          ) : (
            <p className="text-sm text-[var(--muted)]">
              No description available. Click &quot;View Original&quot; to see the full
              job posting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
