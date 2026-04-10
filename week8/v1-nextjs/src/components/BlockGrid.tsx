"use client";

import { JobBlock } from "@/types";
import { BlockCard } from "./BlockCard";

interface Props {
  blocks: JobBlock[];
  onSelect: (block: JobBlock) => void;
}

export function BlockGrid({ blocks, onSelect }: Props) {
  // Group: pinned/recent at top, rest below (like Apple "For You")
  const toApplyBlocks = blocks.filter(
    (b) => b.jobs.filter((j) => j.status === "to_apply").length > 0
  );
  const otherBlocks = blocks.filter(
    (b) => b.jobs.filter((j) => j.status === "to_apply").length === 0
  );

  return (
    <div className="space-y-10">
      {/* Active blocks with pending jobs */}
      {toApplyBlocks.length > 0 && (
        <section>
          <div className="flex items-baseline gap-3 mb-5">
            <h2 className="text-2xl font-bold tracking-tight">Active</h2>
            <p className="text-sm text-[var(--muted)]">
              Blocks with jobs waiting for you
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {toApplyBlocks.map((block) => (
              <BlockCard key={block.id} block={block} onClick={() => onSelect(block)} />
            ))}
          </div>
        </section>
      )}

      {/* All blocks */}
      {otherBlocks.length > 0 && (
        <section>
          <div className="flex items-baseline gap-3 mb-5">
            <h2 className="text-2xl font-bold tracking-tight">
              {toApplyBlocks.length > 0 ? "All Clear" : "Your Blocks"}
            </h2>
            <p className="text-sm text-[var(--muted)]">
              {toApplyBlocks.length > 0
                ? "No pending jobs in these blocks"
                : "Your job tracking categories"}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {otherBlocks.map((block) => (
              <BlockCard key={block.id} block={block} onClick={() => onSelect(block)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
