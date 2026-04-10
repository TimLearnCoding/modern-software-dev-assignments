import { prisma } from "@/lib/prisma";
import { searchJobs } from "@/lib/jobSearch";
import { NextRequest, NextResponse } from "next/server";

// POST /api/jobs/search - search and save jobs for a block
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { blockId, query } = body;

  if (!blockId || !query) {
    return NextResponse.json(
      { error: "blockId and query are required" },
      { status: 400 }
    );
  }

  // Get block to check resume keywords
  const block = await prisma.jobBlock.findUnique({ where: { id: blockId } });
  if (!block) {
    return NextResponse.json({ error: "Block not found" }, { status: 404 });
  }

  const resumeKeywords = block.resumeText
    ? block.resumeText.split(", ").filter(Boolean)
    : [];

  // Search for jobs
  const results = await searchJobs(query, resumeKeywords);

  // Get existing job URLs for this block to avoid duplicates
  const existingUrls = new Set(
    (await prisma.jobPost.findMany({
      where: { blockId },
      select: { url: true },
    })).map((j) => j.url)
  );

  // Save new jobs
  const newJobs = results.filter((r) => !existingUrls.has(r.url));

  if (newJobs.length > 0) {
    await prisma.jobPost.createMany({
      data: newJobs.map((job) => ({
        blockId,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        description: job.description,
        url: job.url,
        source: job.source,
        status: "to_apply",
      })),
    });
  }

  // Return updated block
  const updatedBlock = await prisma.jobBlock.findUnique({
    where: { id: blockId },
    include: {
      jobs: { orderBy: { createdAt: "desc" } },
      sources: true,
    },
  });

  return NextResponse.json(updatedBlock);
}
