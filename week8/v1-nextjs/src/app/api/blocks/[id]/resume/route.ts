import { prisma } from "@/lib/prisma";
import { extractKeywords } from "@/lib/resumeParser";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/blocks/:id/resume - upload resume
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const formData = await req.formData();
  const file = formData.get("resume") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Save file
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const fileName = `${id}-${Date.now()}-${file.name}`;
  const filePath = path.join(uploadsDir, fileName);
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  // Extract text (for now, just read as text - works for .txt, rough for .pdf)
  let resumeText = "";
  try {
    resumeText = Buffer.from(bytes).toString("utf-8");
    // Clean up non-printable characters (common in PDFs)
    resumeText = resumeText.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ");
  } catch {
    resumeText = "";
  }

  const keywords = extractKeywords(resumeText);

  const block = await prisma.jobBlock.update({
    where: { id },
    data: {
      resumePath: `/uploads/${fileName}`,
      resumeText: keywords.join(", "),
    },
    include: { jobs: true, sources: true },
  });

  return NextResponse.json({ block, keywords });
}

// DELETE /api/blocks/:id/resume - remove resume
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const block = await prisma.jobBlock.update({
    where: { id },
    data: { resumePath: null, resumeText: null },
    include: { jobs: true, sources: true },
  });
  return NextResponse.json(block);
}
