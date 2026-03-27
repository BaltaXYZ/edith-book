import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { DEFAULT_BOOK_ROOT } from "@/lib/book-content";

const CONTENT_TYPES: Record<string, string> = {
  ".aac": "audio/aac",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".m4a": "audio/mp4",
  ".md": "text/markdown; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

type FileRouteProps = {
  params: Promise<{
    slug: string[];
  }>;
};

function getContentType(filePath: string): string {
  return CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

function isSafePath(candidatePath: string): boolean {
  const relative = path.relative(DEFAULT_BOOK_ROOT, candidatePath);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

export async function GET(_: Request, { params }: FileRouteProps) {
  const { slug } = await params;
  const candidatePath = path.resolve(DEFAULT_BOOK_ROOT, ...slug);

  if (!isSafePath(candidatePath)) {
    return NextResponse.json({ error: "Ogiltig sokvag." }, { status: 400 });
  }

  try {
    const buffer = await fs.readFile(candidatePath);
    const contentType = getContentType(candidatePath);
    const disposition =
      contentType === "application/pdf" ? "attachment" : "inline";

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Disposition": `${disposition}; filename="${path.basename(candidatePath)}"`,
        "Content-Type": contentType,
      },
    });
  } catch {
    return NextResponse.json({ error: "Filen hittades inte." }, { status: 404 });
  }
}
