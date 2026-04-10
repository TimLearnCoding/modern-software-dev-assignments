import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/blocks - list all blocks with job counts
export async function GET() {
  const blocks = await prisma.jobBlock.findMany({
    include: {
      jobs: { orderBy: { createdAt: "desc" } },
      sources: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(blocks);
}

// POST /api/blocks - create a new block
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, color } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const block = await prisma.jobBlock.create({
    data: {
      title: title.trim(),
      color: color || "#6366f1",
    },
    include: { jobs: true, sources: true },
  });

  return NextResponse.json(block, { status: 201 });
}
