import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/blocks/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const block = await prisma.jobBlock.findUnique({
    where: { id },
    include: {
      jobs: { orderBy: { createdAt: "desc" } },
      sources: true,
    },
  });
  if (!block) {
    return NextResponse.json({ error: "Block not found" }, { status: 404 });
  }
  return NextResponse.json(block);
}

// PUT /api/blocks/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { title, color } = body;

  const block = await prisma.jobBlock.update({
    where: { id },
    data: {
      ...(title && { title: title.trim() }),
      ...(color && { color }),
    },
    include: { jobs: true, sources: true },
  });
  return NextResponse.json(block);
}

// DELETE /api/blocks/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.jobBlock.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
