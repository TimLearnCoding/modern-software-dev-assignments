"use client";

import { useState, useEffect, useCallback } from "react";
import { JobBlock } from "@/types";
import { BlockGrid } from "@/components/BlockGrid";
import { BlockDetail } from "@/components/BlockDetail";
import { CreateBlockModal } from "@/components/CreateBlockModal";
import { Briefcase, Plus, ArrowLeft } from "lucide-react";

export default function Home() {
  const [blocks, setBlocks] = useState<JobBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<JobBlock | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBlocks = useCallback(async () => {
    const res = await fetch("/api/blocks");
    const data = await res.json();
    setBlocks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const handleBlockCreated = async () => {
    setShowCreate(false);
    await fetchBlocks();
  };

  const handleBlockSelect = (block: JobBlock) => {
    setSelectedBlock(block);
  };

  const handleBack = () => {
    setSelectedBlock(null);
    fetchBlocks();
  };

  const handleBlockUpdated = (updated: JobBlock) => {
    setSelectedBlock(updated);
    setBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleBlockDeleted = async () => {
    setSelectedBlock(null);
    await fetchBlocks();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedBlock ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[var(--accent)] hover:opacity-70 font-medium"
              >
                <ArrowLeft size={20} />
                Library
              </button>
            ) : (
              <>
                <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center">
                  <Briefcase size={18} className="text-white" />
                </div>
                <h1 className="text-xl font-semibold tracking-tight">
                  Job Library
                </h1>
              </>
            )}
          </div>

          {!selectedBlock && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 shadow-sm"
            >
              <Plus size={16} />
              New Block
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : selectedBlock ? (
          <BlockDetail
            block={selectedBlock}
            onBack={handleBack}
            onBlockUpdated={handleBlockUpdated}
            onBlockDeleted={handleBlockDeleted}
          />
        ) : (
          <>
            {blocks.length === 0 ? (
              <div className="text-center py-32">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center">
                  <Briefcase size={36} className="text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                  Welcome to Job Library
                </h2>
                <p className="text-[var(--muted)] mb-6 max-w-md mx-auto">
                  Create your first job block to start tracking applications.
                  Each block represents a job category you&apos;re targeting.
                </p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="px-6 py-3 rounded-full bg-[var(--accent)] text-white font-medium hover:opacity-90 shadow-sm"
                >
                  Create Your First Block
                </button>
              </div>
            ) : (
              <BlockGrid blocks={blocks} onSelect={handleBlockSelect} />
            )}
          </>
        )}
      </main>

      {showCreate && (
        <CreateBlockModal
          onClose={() => setShowCreate(false)}
          onCreated={handleBlockCreated}
        />
      )}
    </div>
  );
}
