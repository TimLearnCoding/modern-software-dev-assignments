"use client";

import { useState, useRef, useEffect } from "react";
import { JobBlock, JobPost } from "@/types";
import { JobCard } from "./JobCard";
import { JobDetailModal } from "./JobDetailModal";
import {
  Search,
  Upload,
  Trash2,
  RefreshCw,
  FileText,
  Inbox,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface Props {
  block: JobBlock;
  onBack: () => void;
  onBlockUpdated: (block: JobBlock) => void;
  onBlockDeleted: () => void;
}

export function BlockDetail({ block, onBlockUpdated, onBlockDeleted }: Props) {
  const [searching, setSearching] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toApply = block.jobs.filter((j) => j.status === "to_apply");
  const applied = block.jobs.filter((j) => j.status === "applied");

  // Auto-search on first load if no jobs
  useEffect(() => {
    if (block.jobs.length === 0) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    setSearching(true);
    try {
      const res = await fetch("/api/jobs/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockId: block.id, query: block.title }),
      });
      const updated = await res.json();
      onBlockUpdated(updated);
    } finally {
      setSearching(false);
    }
  };

  const handleApply = async (job: JobPost) => {
    // Open the external job URL
    window.open(job.url, "_blank");

    // Mark as applied
    const res = await fetch(`/api/jobs/${job.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "applied" }),
    });
    const updated = await res.json();

    // Update block state
    onBlockUpdated({
      ...block,
      jobs: block.jobs.map((j) => (j.id === updated.id ? updated : j)),
    });
  };

  const handleUnapply = async (job: JobPost) => {
    const res = await fetch(`/api/jobs/${job.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "to_apply" }),
    });
    const updated = await res.json();
    onBlockUpdated({
      ...block,
      jobs: block.jobs.map((j) => (j.id === updated.id ? updated : j)),
    });
  };

  const handleDeleteJob = async (job: JobPost) => {
    await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
    onBlockUpdated({
      ...block,
      jobs: block.jobs.filter((j) => j.id !== job.id),
    });
  };

  const handleUploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(`/api/blocks/${block.id}/resume`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      onBlockUpdated(data.block);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBlock = async () => {
    if (!confirm("Delete this block and all its jobs?")) return;
    await fetch(`/api/blocks/${block.id}`, { method: "DELETE" });
    onBlockDeleted();
  };

  return (
    <div>
      {/* Block Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: block.color }}
          >
            <span className="text-white text-2xl font-bold">
              {block.title.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{block.title}</h2>
            <p className="text-sm text-[var(--muted)]">
              {toApply.length} to apply &middot; {applied.length} applied
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSearch}
            disabled={searching}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-medium disabled:opacity-50 hover:opacity-90"
          >
            {searching ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Search size={14} />
            )}
            {searching ? "Searching..." : "Find Jobs"}
          </button>
          <button
            onClick={handleDeleteBlock}
            className="p-2 rounded-xl text-[var(--muted)] hover:text-red-500 hover:bg-red-50"
            title="Delete block"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Resume Section */}
      <div className="mb-6 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-[var(--muted)]" />
            {block.resumePath ? (
              <div>
                <span className="text-sm font-medium">Resume uploaded</span>
                {block.resumeText && (
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Keywords: {block.resumeText.split(", ").slice(0, 6).join(", ")}
                  </p>
                )}
              </div>
            ) : (
              <span className="text-sm text-[var(--muted)]">
                Upload a resume for better job matching
              </span>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-light)] text-[var(--accent)] hover:opacity-80"
          >
            {uploading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Upload size={12} />
            )}
            {uploading ? "Uploading..." : block.resumePath ? "Replace" : "Upload"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleUploadResume}
            className="hidden"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[var(--border)] mb-6" />

      {/* Split View: To Apply (left) | Applied (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: To Apply */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Inbox size={18} className="text-[var(--accent)]" />
              To Apply
              <span className="text-xs bg-[var(--accent-light)] text-[var(--accent)] px-2 py-0.5 rounded-full font-medium">
                {toApply.length}
              </span>
            </h3>
            {toApply.length < 5 && !searching && (
              <button
                onClick={handleSearch}
                className="flex items-center gap-1 text-xs text-[var(--accent)] hover:opacity-70"
              >
                <RefreshCw size={12} />
                Refill
              </button>
            )}
          </div>

          {toApply.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-[var(--card-bg)] border border-dashed border-[var(--border)]">
              <Inbox size={32} className="mx-auto text-[var(--muted)] mb-3" />
              <p className="text-sm text-[var(--muted)] mb-3">
                No jobs to apply yet
              </p>
              <button
                onClick={handleSearch}
                disabled={searching}
                className="text-sm text-[var(--accent)] font-medium hover:opacity-70"
              >
                {searching ? "Searching..." : "Search for jobs"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {toApply.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={() => handleApply(job)}
                  onDelete={() => handleDeleteJob(job)}
                  onViewDetail={() => setSelectedJob(job)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Applied */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[var(--success)]" />
              Applied
              <span className="text-xs bg-emerald-50 text-[var(--success)] px-2 py-0.5 rounded-full font-medium">
                {applied.length}
              </span>
            </h3>
          </div>

          {applied.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-[var(--card-bg)] border border-dashed border-[var(--border)]">
              <CheckCircle2
                size={32}
                className="mx-auto text-[var(--muted)] mb-3"
              />
              <p className="text-sm text-[var(--muted)]">
                Applied jobs will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {applied.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isApplied
                  onUnapply={() => handleUnapply(job)}
                  onDelete={() => handleDeleteJob(job)}
                  onViewDetail={() => setSelectedJob(job)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={
            selectedJob.status === "to_apply"
              ? () => {
                  handleApply(selectedJob);
                  setSelectedJob(null);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
