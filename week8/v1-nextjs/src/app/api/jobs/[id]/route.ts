import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PUT /api/jobs/:id - update job status (apply / unapply)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!["to_apply", "applied"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const job = await prisma.jobPost.update({
    where: { id },
    data: {
      status,
      appliedAt: status === "applied" ? new Date() : null,
    },
  });

  return NextResponse.json(job);
}

// DELETE /api/jobs/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.jobPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
